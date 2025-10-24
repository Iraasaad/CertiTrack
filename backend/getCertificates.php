<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_errors', 0);
error_reporting(0);
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  exit(0);
}

header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Certitrack";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

$whereClause = $userId ? "WHERE user_id = $userId" : "";

$sqlCertificates = "SELECT *, 'certificate' as type FROM certificates $whereClause";
$resultCertificates = $conn->query($sqlCertificates);

$sqlDiplomas = "SELECT *, 'diploma' as type FROM diplomas $whereClause";
$resultDiplomas = $conn->query($sqlDiplomas);

$allDocuments = [];

if ($resultCertificates && $resultCertificates->num_rows > 0) {
  while ($row = $resultCertificates->fetch_assoc()) {
      if (isset($row['completionDate']) && !isset($row['graduationDate'])) {
          $row['graduationDate'] = $row['completionDate'];
      }
      $allDocuments[] = $row;
  }
}

if ($resultDiplomas && $resultDiplomas->num_rows > 0) {
  while ($row = $resultDiplomas->fetch_assoc()) {
      if (isset($row['completionDate']) && !isset($row['graduationDate'])) {
          $row['graduationDate'] = $row['completionDate'];
      }
      $allDocuments[] = $row;
  }
}

usort($allDocuments, function($a, $b) {
    return $a['id'] - $b['id'];
});

if (count($allDocuments) > 0) {
  echo json_encode(["success" => true, "data" => $allDocuments]);
} else {
  echo json_encode(["success" => true, "data" => []]);
}

$conn->close();
?>

