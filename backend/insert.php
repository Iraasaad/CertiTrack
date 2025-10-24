<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
ini_set('display_errors', 0);
error_reporting(0);
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

$uploadsDir = __DIR__ . '/uploads/';
if (!file_exists($uploadsDir)) {
   mkdir($uploadsDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['documentFile'])) {
   $fullName = $conn->real_escape_string($_POST["fullName"]);
   $gender = $conn->real_escape_string($_POST["gender"]);
   $title = $conn->real_escape_string($_POST["title"]);
   $institution = $conn->real_escape_string($_POST["institution"]);
   $country = $conn->real_escape_string($_POST["country"]);
   $fieldOfStudy = $conn->real_escape_string($_POST["fieldOfStudy"]);
   $completionDate = $conn->real_escape_string($_POST["completionDate"]);
   $serialNumber = isset($_POST["serialNumber"]) ? $conn->real_escape_string($_POST["serialNumber"]) : "";
   $type = $conn->real_escape_string($_POST["type"]);
   $grade = isset($_POST["grade"]) ? $conn->real_escape_string($_POST["grade"]) : "";
   
   $userId = isset($_POST["user_id"]) ? intval($_POST["user_id"]) : null;
   
   $file = $_FILES['documentFile'];
   $fileName = $file['name'];
   $fileTmpName = $file['tmp_name'];
   $fileSize = $file['size'];
   $fileError = $file['error'];
   $fileType = $file['type'];
   
   $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
   $uniqueFileName = uniqid() . '_' . str_replace(' ', '_', strtolower($fullName)) . '.' . $fileExtension;
   $fileDestination = $uploadsDir . $uniqueFileName;
   
   if ($fileError !== 0) {
       echo json_encode(["success" => false, "message" => "Error uploading file: " . $fileError]);
       exit;
   }
   
   if ($fileSize > 10 * 1024 * 1024) {
       echo json_encode(["success" => false, "message" => "File size must be less than 10MB"]);
       exit;
   }
   
   $allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
   if (!in_array($fileType, $allowedTypes)) {
       echo json_encode(["success" => false, "message" => "Only PDF, JPG, and PNG files are allowed"]);
       exit;
   }
   
   if (!move_uploaded_file($fileTmpName, $fileDestination)) {
       echo json_encode(["success" => false, "message" => "Failed to move uploaded file"]);
       exit;
   }
   
   $table = ($type === "diploma") ? "diplomas" : "certificates";
   
   $fields = "fullName, gender, title, institution, country, fieldOfStudy, completionDate, serialNumber, type, pdfFile, validation_status";
   $values = "'$fullName', '$gender', '$title', '$institution', '$country', '$fieldOfStudy', '$completionDate', '$serialNumber', '$type', '$uniqueFileName', 'pending'";
   
   if (!empty($grade)) {
       $fields .= ", grade";
       $values .= ", '$grade'";
   }
   
   if ($userId) {
       $fields .= ", user_id";
       $values .= ", $userId";
   }
   
   $sql = "INSERT INTO $table ($fields) VALUES ($values)";

   if ($conn->query($sql) === TRUE) {
       $documentId = $conn->insert_id;
       echo json_encode([
           "success" => true, 
           "message" => "$type added successfully",
           "document_id" => $documentId
       ]);
   } else {
       echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
   }
} else {
   $data = json_decode(file_get_contents("php://input"), true);

   if ($data) {
       $fullName = $conn->real_escape_string($data["fullName"]);
       $gender = $conn->real_escape_string($data["gender"]);
       $title = $conn->real_escape_string($data["title"]);
       $institution = $conn->real_escape_string($data["institution"]);
       $country = $conn->real_escape_string($data["country"]);
       $fieldOfStudy = $conn->real_escape_string($data["fieldOfStudy"]);
       $completionDate = $conn->real_escape_string($data["completionDate"]);
       $serialNumber = isset($data["serialNumber"]) ? $conn->real_escape_string($data["serialNumber"]) : "";
       $type = $conn->real_escape_string($data["type"]);
       $grade = isset($data["grade"]) ? $conn->real_escape_string($data["grade"]) : "";
       
 
       $userId = isset($data["user_id"]) ? intval($data["user_id"]) : null;
       
    
       $table = ($type === "diploma") ? "diplomas" : "certificates";
       
  
       $fields = "fullName, gender, title, institution, country, fieldOfStudy, completionDate, serialNumber, type, validation_status";
       $values = "'$fullName', '$gender', '$title', '$institution', '$country', '$fieldOfStudy', '$completionDate', '$serialNumber', '$type', 'pending'";
       
   
       if (!empty($grade)) {
           $fields .= ", grade";
           $values .= ", '$grade'";
       }
       
     
       if ($userId) {
           $fields .= ", user_id";
           $values .= ", $userId";
       }
       
       $sql = "INSERT INTO $table ($fields) VALUES ($values)";

       if ($conn->query($sql) === TRUE) {
           $documentId = $conn->insert_id;
           echo json_encode([
               "success" => true, 
               "message" => "$type added successfully",
               "document_id" => $documentId
           ]);
       } else {
           echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
       }
   } else {
       echo json_encode(["success" => false, "message" => "Invalid data received"]);
   }
}

$conn->close();
?>

