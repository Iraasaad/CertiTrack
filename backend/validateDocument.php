<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

ini_set('display_errors', 0);
error_reporting(0);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
   exit(0);
}

try {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "Certitrack";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        throw new Exception("Invalid data received");
    }

    if (!isset($data['document_id']) || !isset($data['status']) || !isset($data['admin_id'])) {
        throw new Exception("Missing required fields");
    }

    $documentId = intval($data['document_id']);
    $status = $conn->real_escape_string($data['status']);
    $notes = isset($data['notes']) ? $conn->real_escape_string($data['notes']) : '';
    $adminId = intval($data['admin_id']);
    $type = isset($data['type']) ? $conn->real_escape_string($data['type']) : null;

    if (!$type) {
        $checkDiploma = "SELECT id FROM diplomas WHERE id = $documentId";
        $resultDiploma = $conn->query($checkDiploma);
        
        if ($resultDiploma->num_rows > 0) {
            $type = "diploma";
        } else {
            $checkCertificate = "SELECT id FROM certificates WHERE id = $documentId";
            $resultCertificate = $conn->query($checkCertificate);
            
            if ($resultCertificate->num_rows > 0) {
                $type = "certificate";
            } else {
                throw new Exception("Document not found");
            }
        }
    }

    $table = ($type === "diploma") ? "diplomas" : "certificates";

    $checkColumn = "SHOW COLUMNS FROM $table LIKE 'validation_status'";
    $columnExists = $conn->query($checkColumn)->num_rows > 0;

    if (!$columnExists) {
        $alterTable = "ALTER TABLE $table 
                      ADD COLUMN validation_status ENUM('pending', 'validated', 'rejected') NOT NULL DEFAULT 'pending',
                      ADD COLUMN validation_date DATETIME NULL,
                      ADD COLUMN validation_notes TEXT NULL,
                      ADD COLUMN validated_by INT NULL";
        
        if (!$conn->query($alterTable)) {
            throw new Exception("Failed to update database structure: " . $conn->error);
        }
    }

    $currentDate = date('Y-m-d H:i:s');
    $sql = "UPDATE $table 
           SET validation_status = '$status', 
               validation_date = '$currentDate', 
               validation_notes = '$notes', 
               validated_by = $adminId 
           WHERE id = $documentId";

    if (!$conn->query($sql)) {
        throw new Exception("Error updating document: " . $conn->error);
    }

    echo json_encode([
        "success" => true, 
        "message" => "Document " . ($status === 'validated' ? 'validated' : 'rejected') . " successfully"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?>

