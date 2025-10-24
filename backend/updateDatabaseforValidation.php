<?php

header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Certitrack";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$alterCertificates = "ALTER TABLE certificates 
                     ADD COLUMN validation_status ENUM('pending', 'validated', 'rejected') NOT NULL DEFAULT 'pending',
                     ADD COLUMN validation_date DATETIME NULL,
                     ADD COLUMN validation_notes TEXT NULL,
                     ADD COLUMN validated_by INT NULL";

$alterDiplomas = "ALTER TABLE diplomas 
                 ADD COLUMN validation_status ENUM('pending', 'validated', 'rejected') NOT NULL DEFAULT 'pending',
                 ADD COLUMN validation_date DATETIME NULL,
                 ADD COLUMN validation_notes TEXT NULL,
                 ADD COLUMN validated_by INT NULL";

$success = true;
$messages = [];

if ($conn->query($alterCertificates) === TRUE) {
    $messages[] = "Certificates table updated successfully";
} else {
    $success = false;
    $messages[] = "Error updating certificates table: " . $conn->error;
}

if ($conn->query($alterDiplomas) === TRUE) {
    $messages[] = "Diplomas table updated successfully";
} else {
    $success = false;
    $messages[] = "Error updating diplomas table: " . $conn->error;
}

$createIndexCertificates = "CREATE INDEX idx_certificates_validation ON certificates(validation_status)";
$createIndexDiplomas = "CREATE INDEX idx_diplomas_validation ON diplomas(validation_status)";

if ($conn->query($createIndexCertificates) === TRUE) {
    $messages[] = "Index created on certificates table";
} else {
    $messages[] = "Note: Index may already exist on certificates table: " . $conn->error;
}

if ($conn->query($createIndexDiplomas) === TRUE) {
    $messages[] = "Index created on diplomas table";
} else {
    $messages[] = "Note: Index may already exist on diplomas table: " . $conn->error;
}

$conn->close();

echo json_encode([
    "success" => $success,
    "messages" => $messages
]);
?>

