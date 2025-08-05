<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$database = new Database();
$db = $database->getConnection();

$action = $_GET['action'] ?? '';
$type = $_GET['type'] ?? '';

switch ($action) {
    case 'get':
        handle_get_content($db, $type);
        break;
    case 'create':
        handle_create_content($db, $type);
        break;
    case 'update':
        handle_update_content($db, $type);
        break;
    case 'delete':
        handle_delete_content($db, $type);
        break;
    default:
        generate_response(false, 'Invalid action');
}

function handle_get_content($db, $type) {
    try {
        switch ($type) {
            case 'news':
                $query = "SELECT * FROM news WHERE status = 'published' ORDER BY publish_date DESC";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
                generate_response(true, 'News retrieved successfully', $news);
                break;
                
            case 'faqs':
                $query = "SELECT * FROM faqs WHERE is_active = 1 ORDER BY id ASC";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
                generate_response(true, 'FAQs retrieved successfully', $faqs);
                break;
                
            case 'downloads':
                $query = "SELECT * FROM downloads WHERE is_public = 1 ORDER BY created_at DESC";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $downloads = $stmt->fetchAll(PDO::FETCH_ASSOC);
                generate_response(true, 'Downloads retrieved successfully', $downloads);
                break;
                
            case 'gallery':
                $query = "SELECT * FROM gallery WHERE is_active = 1 ORDER BY created_at DESC";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $gallery = $stmt->fetchAll(PDO::FETCH_ASSOC);
                generate_response(true, 'Gallery retrieved successfully', $gallery);
                break;
                
            case 'contact':
                $query = "SELECT * FROM contact_info WHERE is_primary = 1 LIMIT 1";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $contact = $stmt->fetch(PDO::FETCH_ASSOC);
                generate_response(true, 'Contact info retrieved successfully', $contact);
                break;
                
            default:
                generate_response(false, 'Invalid content type');
        }
    } catch (Exception $e) {
        generate_response(false, 'Failed to retrieve content: ' . $e->getMessage());
    }
}

function handle_create_content($db, $type) {
    check_auth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        generate_response(false, 'Method not allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $_SESSION['user_id'];

    try {
        switch ($type) {
            case 'news':
                $title = sanitize_input($data['title'] ?? '');
                $content = sanitize_input($data['content'] ?? '');
                $publish_date = $data['publish_date'] ?? date('Y-m-d');
                
                if (empty($title) || empty($content)) {
                    generate_response(false, 'Title and content are required');
                }
                
                $query = "INSERT INTO news (title, content, publish_date, created_by) VALUES (?, ?, ?, ?)";
                $stmt = $db->prepare($query);
                $stmt->execute([$title, $content, $publish_date, $user_id]);
                
                generate_response(true, 'News created successfully');
                break;
                
            case 'faq':
                $question = sanitize_input($data['question'] ?? '');
                $answer = sanitize_input($data['answer'] ?? '');
                $category = sanitize_input($data['category'] ?? '');
                
                if (empty($question) || empty($answer)) {
                    generate_response(false, 'Question and answer are required');
                }
                
                $query = "INSERT INTO faqs (question, answer, category, created_by) VALUES (?, ?, ?, ?)";
                $stmt = $db->prepare($query);
                $stmt->execute([$question, $answer, $category, $user_id]);
                
                generate_response(true, 'FAQ created successfully');
                break;
                
            case 'download':
                $title = sanitize_input($data['title'] ?? '');
                $description = sanitize_input($data['description'] ?? '');
                $file_name = sanitize_input($data['file_name'] ?? '');
                $file_path = sanitize_input($data['file_path'] ?? '');
                $file_size = $data['file_size'] ?? 0;
                $file_type = sanitize_input($data['file_type'] ?? '');
                $category = sanitize_input($data['category'] ?? '');
                
                if (empty($title) || empty($file_name) || empty($file_path)) {
                    generate_response(false, 'Title, file name, and file path are required');
                }
                
                $query = "INSERT INTO downloads (title, description, file_name, file_path, file_size, file_type, category, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $db->prepare($query);
                $stmt->execute([$title, $description, $file_name, $file_path, $file_size, $file_type, $category, $user_id]);
                
                generate_response(true, 'Download created successfully');
                break;
                
            case 'gallery':
                $title = sanitize_input($data['title'] ?? '');
                $description = sanitize_input($data['description'] ?? '');
                $image_path = sanitize_input($data['image_path'] ?? '');
                $thumbnail_path = sanitize_input($data['thumbnail_path'] ?? '');
                $category = sanitize_input($data['category'] ?? '');
                
                if (empty($title) || empty($image_path)) {
                    generate_response(false, 'Title and image path are required');
                }
                
                $query = "INSERT INTO gallery (title, description, image_path, thumbnail_path, category, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $db->prepare($query);
                $stmt->execute([$title, $description, $image_path, $thumbnail_path, $category, $user_id]);
                
                generate_response(true, 'Gallery item created successfully');
                break;
                
            default:
                generate_response(false, 'Invalid content type');
        }
    } catch (Exception $e) {
        generate_response(false, 'Failed to create content: ' . $e->getMessage());
    }
}

function handle_update_content($db, $type) {
    check_auth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        generate_response(false, 'Method not allowed');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? 0;

    if (!$id) {
        generate_response(false, 'ID is required');
    }

    try {
        switch ($type) {
            case 'news':
                $title = sanitize_input($data['title'] ?? '');
                $content = sanitize_input($data['content'] ?? '');
                $publish_date = $data['publish_date'] ?? '';
                $status = sanitize_input($data['status'] ?? 'draft');
                
                $query = "UPDATE news SET title = ?, content = ?, publish_date = ?, status = ? WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$title, $content, $publish_date, $status, $id]);
                
                generate_response(true, 'News updated successfully');
                break;
                
            case 'faq':
                $question = sanitize_input($data['question'] ?? '');
                $answer = sanitize_input($data['answer'] ?? '');
                $category = sanitize_input($data['category'] ?? '');
                $is_active = $data['is_active'] ?? 1;
                
                $query = "UPDATE faqs SET question = ?, answer = ?, category = ?, is_active = ? WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$question, $answer, $category, $is_active, $id]);
                
                generate_response(true, 'FAQ updated successfully');
                break;
                
            case 'download':
                $title = sanitize_input($data['title'] ?? '');
                $description = sanitize_input($data['description'] ?? '');
                $category = sanitize_input($data['category'] ?? '');
                $is_public = $data['is_public'] ?? 1;
                
                $query = "UPDATE downloads SET title = ?, description = ?, category = ?, is_public = ? WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$title, $description, $category, $is_public, $id]);
                
                generate_response(true, 'Download updated successfully');
                break;
                
            case 'gallery':
                $title = sanitize_input($data['title'] ?? '');
                $description = sanitize_input($data['description'] ?? '');
                $category = sanitize_input($data['category'] ?? '');
                $is_active = $data['is_active'] ?? 1;
                
                $query = "UPDATE gallery SET title = ?, description = ?, category = ?, is_active = ? WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$title, $description, $category, $is_active, $id]);
                
                generate_response(true, 'Gallery item updated successfully');
                break;
                
            default:
                generate_response(false, 'Invalid content type');
        }
    } catch (Exception $e) {
        generate_response(false, 'Failed to update content: ' . $e->getMessage());
    }
}

function handle_delete_content($db, $type) {
    check_auth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        generate_response(false, 'Method not allowed');
    }

    $id = $_GET['id'] ?? 0;

    if (!$id) {
        generate_response(false, 'ID is required');
    }

    try {
        switch ($type) {
            case 'news':
                $query = "DELETE FROM news WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$id]);
                generate_response(true, 'News deleted successfully');
                break;
                
            case 'faq':
                $query = "DELETE FROM faqs WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$id]);
                generate_response(true, 'FAQ deleted successfully');
                break;
                
            case 'download':
                $query = "DELETE FROM downloads WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$id]);
                generate_response(true, 'Download deleted successfully');
                break;
                
            case 'gallery':
                $query = "DELETE FROM gallery WHERE id = ?";
                $stmt = $db->prepare($query);
                $stmt->execute([$id]);
                generate_response(true, 'Gallery item deleted successfully');
                break;
                
            default:
                generate_response(false, 'Invalid content type');
        }
    } catch (Exception $e) {
        generate_response(false, 'Failed to delete content: ' . $e->getMessage());
    }
}
?> 