<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'maaddii_sacco');
define('DB_USER', 'root');
define('DB_PASS', '');

// Application Configuration
define('APP_NAME', 'Maaddii SACCOs');
define('APP_URL', 'http://localhost/sacco-website');
define('UPLOAD_PATH', '../uploads/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB

// Security Configuration
define('JWT_SECRET', 'your-secret-key-here');
define('PASSWORD_SALT', 'your-salt-here');

// Email Configuration (for notifications)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('FROM_EMAIL', 'noreply@maaddiisacco.com');
define('FROM_NAME', 'Maaddii SACCOs');

// Database Connection Class
class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}

// Utility Functions
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function generate_response($success, $message, $data = null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

function check_auth() {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        generate_response(false, 'Authentication required');
    }
}

function hash_password($password) {
    return password_hash($password . PASSWORD_SALT, PASSWORD_DEFAULT);
}

function verify_password($password, $hash) {
    return password_verify($password . PASSWORD_SALT, $hash);
}

function send_email($to, $subject, $message) {
    // Basic email sending (replace with proper SMTP implementation)
    $headers = "From: " . FROM_EMAIL . "\r\n";
    $headers .= "Reply-To: " . FROM_EMAIL . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    return mail($to, $subject, $message, $headers);
}
?> 