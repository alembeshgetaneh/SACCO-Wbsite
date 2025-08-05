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
    case 'login':
        handle_login($db);
        break;
    case 'logout':
        handle_logout();
        break;
    case 'register':
        handle_register($db);
        break;
    case 'change_password':
        handle_change_password($db);
        break;
    default:
        generate_response(false, 'Invalid action');
}

function handle_login($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        generate_response(false, 'Method not allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $username = sanitize_input($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        generate_response(false, 'Username and password are required');
    }

    try {
        $query = "SELECT id, username, password_hash, email, role, first_name, last_name FROM users WHERE username = ? AND is_active = 1";
        $stmt = $db->prepare($query);
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && verify_password($password, $user['password_hash'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['login_time'] = time();

            // Send email notification for admin login
            if ($user['role'] === 'admin') {
                $subject = "Admin Login Notification";
                $message = "Admin user {$user['username']} logged in at " . date('Y-m-d H:i:s');
                send_email($user['email'], $subject, $message);
            }

            generate_response(true, 'Login successful', [
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name']
                ]
            ]);
        } else {
            generate_response(false, 'Invalid username or password');
        }
    } catch (Exception $e) {
        generate_response(false, 'Login failed: ' . $e->getMessage());
    }
}

function handle_logout() {
    session_start();
    session_destroy();
    generate_response(true, 'Logout successful');
}

function handle_register($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        generate_response(false, 'Method not allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $username = sanitize_input($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $email = sanitize_input($data['email'] ?? '');
    $first_name = sanitize_input($data['first_name'] ?? '');
    $last_name = sanitize_input($data['last_name'] ?? '');
    $role = sanitize_input($data['role'] ?? 'member');

    if (empty($username) || empty($password) || empty($email)) {
        generate_response(false, 'All fields are required');
    }

    try {
        // Check if username or email already exists
        $query = "SELECT id FROM users WHERE username = ? OR email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$username, $email]);
        
        if ($stmt->fetch()) {
            generate_response(false, 'Username or email already exists');
        }

        // Create new user
        $password_hash = hash_password($password);
        $query = "INSERT INTO users (username, password_hash, email, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        $stmt->execute([$username, $password_hash, $email, $role, $first_name, $last_name]);

        generate_response(true, 'User registered successfully');
    } catch (Exception $e) {
        generate_response(false, 'Registration failed: ' . $e->getMessage());
    }
}

function handle_change_password($db) {
    check_auth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        generate_response(false, 'Method not allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $current_password = $data['current_password'] ?? '';
    $new_password = $data['new_password'] ?? '';

    if (empty($current_password) || empty($new_password)) {
        generate_response(false, 'Current and new password are required');
    }

    try {
        $user_id = $_SESSION['user_id'];
        
        // Verify current password
        $query = "SELECT password_hash FROM users WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !verify_password($current_password, $user['password_hash'])) {
            generate_response(false, 'Current password is incorrect');
        }

        // Update password
        $new_password_hash = hash_password($new_password);
        $query = "UPDATE users SET password_hash = ? WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$new_password_hash, $user_id]);

        generate_response(true, 'Password changed successfully');
    } catch (Exception $e) {
        generate_response(false, 'Password change failed: ' . $e->getMessage());
    }
}
?> 