<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Certitrack";

$documentId = isset($_GET['id']) ? intval($_GET['id']) : 0;
$documentType = isset($_GET['type']) ? $_GET['type'] : '';

if (!$documentId || !$documentType) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Document ID and type are required']);
    exit;
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$table = ($documentType === 'diploma') ? 'diplomas' : 'certificates';

$sql = "SELECT title, pdfFile FROM $table WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $documentId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['success' => false, 'message' => 'Document not found']);
    exit;
}

$document = $result->fetch_assoc();
$filePath = __DIR__ . '/uploads/' . $document['pdfFile'];

if (!file_exists($filePath)) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['success' => false, 'message' => 'File not found on server']);
    exit;
}

$fileInfo = pathinfo($filePath);
$fileName = $document['title'] . '.' . $fileInfo['extension'];

header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $fileName . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($filePath));

ob_clean();
flush();

readfile($filePath);
exit;
?>

