<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Certitrack";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["success" => false, "message" => "Invalid data received"]);
  exit;
}

if (!isset($data['document_id']) || !isset($data['user_id'])) {
  echo json_encode(["success" => false, "message" => "Document ID and user ID are required"]);
  exit;
}

$documentId = intval($data['document_id']);
$userId = intval($data['user_id']);
$type = isset($data['type']) ? $conn->real_escape_string($data['type']) : null;

if ($type) {
  $table = ($type === "diploma") ? "diplomas" : "certificates";
} else {
  $checkDiploma = "SELECT id, pdfFile FROM diplomas WHERE id = $documentId AND user_id = $userId";
  $resultDiploma = $conn->query($checkDiploma);
  
  if ($resultDiploma->num_rows > 0) {
    $table = "diplomas";
    $document = $resultDiploma->fetch_assoc();
  } else {
    $checkCertificate = "SELECT id, pdfFile FROM certificates WHERE id = $documentId AND user_id = $userId";
    $resultCertificate = $conn->query($checkCertificate);
    
    if ($resultCertificate->num_rows > 0) {
      $table = "certificates";
      $document = $resultCertificate->fetch_assoc();
    } else {
      echo json_encode(["success" => false, "message" => "Document not found or you don't have permission to delete it"]);
      exit;
    }
  }
}

$sql = "DELETE FROM $table WHERE id = $documentId AND user_id = $userId";

if ($conn->query($sql) === TRUE) {
  if (isset($document['pdfFile'])) {
    $filePath = __DIR__ . '/uploads/' . $document['pdfFile'];
    if (file_exists($filePath)) {
      unlink($filePath);
    }
  }
  
  echo json_encode(["success" => true, "message" => "Document deleted successfully"]);
} else {
  echo json_encode(["success" => false, "message" => "Error deleting document: " . $conn->error]);
}

$conn->close();
?>

