<?php
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

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

    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : null;

    $sqlCertificates = "SELECT c.*, u.name as user_name, u.email as user_email, 'certificate' as type 
                      FROM certificates c
                      LEFT JOIN users u ON c.user_id = u.id
                      ORDER BY c.id DESC";

    $sqlDiplomas = "SELECT d.*, u.name as user_name, u.email as user_email, 'diploma' as type 
                  FROM diplomas d
                  LEFT JOIN users u ON d.user_id = u.id
                  ORDER BY d.id DESC";

    if ($limit) {
        $sqlCertificates .= " LIMIT $limit";
        $sqlDiplomas .= " LIMIT $limit";
    }

    $resultCertificates = $conn->query($sqlCertificates);
    $resultDiplomas = $conn->query($sqlDiplomas);

    if (!$resultCertificates || !$resultDiplomas) {
        throw new Exception("Database query error: " . $conn->error);
    }

    $allDocuments = [];

    if ($resultCertificates->num_rows > 0) {
        while ($row = $resultCertificates->fetch_assoc()) {
            if (!isset($row['validation_status'])) {
                $row['validation_status'] = 'pending';
            }
            $allDocuments[] = $row;
        }
    }

    if ($resultDiplomas->num_rows > 0) {
        while ($row = $resultDiplomas->fetch_assoc()) {
            if (!isset($row['validation_status'])) {
                $row['validation_status'] = 'pending';
            }
            $allDocuments[] = $row;
        }
    }

    usort($allDocuments, function($a, $b) {
        return $b['id'] - $a['id'];
    });

    if ($limit && count($allDocuments) > $limit) {
        $allDocuments = array_slice($allDocuments, 0, $limit);
    }

    echo json_encode(["success" => true, "data" => $allDocuments]);
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

