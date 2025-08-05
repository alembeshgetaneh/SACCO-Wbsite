<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$database = new Database();
$db = $database->getConnection();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'submit':
        handle_contact_submission($db);
        break;
    case 'get_feedback':
        handle_get_feedback($db);
        break;
    case 'reply':
        handle_reply_feedback($db);
        break;
    default:
        generate_response(false, 'Invalid action');
}

function handle_contact_submission($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        generate_response(false, 'Method not allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $name = sanitize_input($data['name'] ?? '');
    $email = sanitize_input($data['email'] ?? '');
    $message = sanitize_input($data['message'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        generate_response(false, 'All fields are required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        generate_response(false, 'Invalid email address');
    }

    try {
        // Save feedback to database
        $query = "INSERT INTO customer_feedback (name, email, message) VALUES (?, ?, ?)";
        $stmt = $db->prepare($query);
        $stmt->execute([$name, $email, $message]);
        $feedback_id = $db->lastInsertId();

        // Send email notification to admin
        $admin_email = 'admin@maaddiisacco.com'; // Get from database or config
        $subject = "New Contact Form Submission - Maaddii SACCOs";
        
        $email_message = "
        <html>
        <head>
            <title>New Contact Form Submission</title>
        </head>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> {$name} ({$email})</p>
            <p><strong>Message:</strong></p>
            <p>" . nl2br($message) . "</p>
            <p><strong>Submitted:</strong> " . date('Y-m-d H:i:s') . "</p>
            <p><strong>Feedback ID:</strong> {$feedback_id}</p>
            <hr>
            <p>This is an automated notification from the Maaddii SACCOs website.</p>
        </body>
        </html>
        ";

        // Send email to admin
        $headers = "From: " . FROM_EMAIL . "\r\n";
        $headers .= "Reply-To: {$email}\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        
        $email_sent = mail($admin_email, $subject, $email_message, $headers);

        // Send confirmation email to user
        $user_subject = "Thank you for contacting Maaddii SACCOs";
        $user_message = "
        <html>
        <head>
            <title>Thank you for contacting us</title>
        </head>
        <body>
            <h2>Thank you for contacting Maaddii SACCOs</h2>
            <p>Dear {$name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <p>" . nl2br($message) . "</p>
            <hr>
            <p>Best regards,<br>Maaddii SACCOs Team</p>
        </body>
        </html>
        ";

        $user_headers = "From: " . FROM_EMAIL . "\r\n";
        $user_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        
        mail($email, $user_subject, $user_message, $user_headers);

        generate_response(true, 'Thank you for your message! We will get back to you soon.', [
            'feedback_id' => $feedback_id,
            'email_sent' => $email_sent
        ]);

    } catch (Exception $e) {
        generate_response(false, 'Failed to submit feedback: ' . $e->getMessage());
    }
}

function handle_get_feedback($db) {
    check_auth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        generate_response(false, 'Method not allowed');
    }

    try {
        $status = $_GET['status'] ?? '';
        $limit = $_GET['limit'] ?? 50;
        $offset = $_GET['offset'] ?? 0;

        $where_clause = "";
        $params = [];

        if ($status) {
            $where_clause = "WHERE status = ?";
            $params[] = $status;
        }

        $query = "SELECT * FROM customer_feedback {$where_clause} ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $params[] = (int)$limit;
        $params[] = (int)$offset;

        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $feedback = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count
        $count_query = "SELECT COUNT(*) as total FROM customer_feedback {$where_clause}";
        $count_stmt = $db->prepare($count_query);
        $count_stmt->execute(array_slice($params, 0, -2));
        $total = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];

        generate_response(true, 'Feedback retrieved successfully', [
            'feedback' => $feedback,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]);

    } catch (Exception $e) {
        generate_response(false, 'Failed to retrieve feedback: ' . $e->getMessage());
    }
}

function handle_reply_feedback($db) {
    check_auth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        generate_response(false, 'Method not allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $feedback_id = $data['feedback_id'] ?? 0;
    $reply_message = sanitize_input($data['reply_message'] ?? '');

    if (!$feedback_id || empty($reply_message)) {
        generate_response(false, 'Feedback ID and reply message are required');
    }

    try {
        // Get feedback details
        $query = "SELECT * FROM customer_feedback WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$feedback_id]);
        $feedback = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$feedback) {
            generate_response(false, 'Feedback not found');
        }

        // Update feedback with reply
        $user_id = $_SESSION['user_id'];
        $query = "UPDATE customer_feedback SET status = 'replied', reply_message = ?, replied_by = ?, reply_date = NOW() WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$reply_message, $user_id, $feedback_id]);

        // Send reply email to customer
        $subject = "Re: Your message to Maaddii SACCOs";
        $email_message = "
        <html>
        <head>
            <title>Response from Maaddii SACCOs</title>
        </head>
        <body>
            <h2>Response from Maaddii SACCOs</h2>
            <p>Dear {$feedback['name']},</p>
            <p>Thank you for contacting us. Here is our response to your message:</p>
            <hr>
            <p><strong>Your original message:</strong></p>
            <p>" . nl2br($feedback['message']) . "</p>
            <hr>
            <p><strong>Our response:</strong></p>
            <p>" . nl2br($reply_message) . "</p>
            <hr>
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Maaddii SACCOs Team</p>
        </body>
        </html>
        ";

        $headers = "From: " . FROM_EMAIL . "\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        
        $email_sent = mail($feedback['email'], $subject, $email_message, $headers);

        generate_response(true, 'Reply sent successfully', [
            'email_sent' => $email_sent
        ]);

    } catch (Exception $e) {
        generate_response(false, 'Failed to send reply: ' . $e->getMessage());
    }
}
?> 