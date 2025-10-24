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

    $sqlUsers = "SELECT COUNT(*) as total FROM users";
    $resultUsers = $conn->query($sqlUsers);
    $totalUsers = $resultUsers->fetch_assoc()['total'];

    $sqlTotalDocuments = "SELECT 
        (SELECT COUNT(*) FROM diplomas) + 
        (SELECT COUNT(*) FROM certificates) as total";
    $resultTotalDocs = $conn->query($sqlTotalDocuments);
    $totalDocuments = $resultTotalDocs->fetch_assoc()['total'];

    $sqlPending = "SELECT 
        (SELECT COUNT(*) FROM diplomas WHERE validation_status = 'pending') + 
        (SELECT COUNT(*) FROM certificates WHERE validation_status = 'pending') as total";
    $resultPending = $conn->query($sqlPending);
    $pendingValidations = $resultPending->fetch_assoc()['total'];

    $sqlValidated = "SELECT 
        (SELECT COUNT(*) FROM diplomas WHERE validation_status = 'validated') + 
        (SELECT COUNT(*) FROM certificates WHERE validation_status = 'validated') as total";
    $resultValidated = $conn->query($sqlValidated);
    $validatedDocuments = $resultValidated->fetch_assoc()['total'];

    $sqlRejected = "SELECT 
        (SELECT COUNT(*) FROM diplomas WHERE validation_status = 'rejected') + 
        (SELECT COUNT(*) FROM certificates WHERE validation_status = 'rejected') as total";
    $resultRejected = $conn->query($sqlRejected);
    $rejectedDocuments = $resultRejected->fetch_assoc()['total'];

    $sqlDiplomas = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN validation_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN validation_status = 'validated' THEN 1 ELSE 0 END) as validated,
        SUM(CASE WHEN validation_status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM diplomas";
    $resultDiplomas = $conn->query($sqlDiplomas);
    $diplomaStats = $resultDiplomas->fetch_assoc();

    $sqlCertificates = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN validation_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN validation_status = 'validated' THEN 1 ELSE 0 END) as validated,
        SUM(CASE WHEN validation_status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM certificates";
    $resultCertificates = $conn->query($sqlCertificates);
    $certificateStats = $resultCertificates->fetch_assoc();

    $response = [
        "success" => true,
        "stats" => [
            "totalUsers" => (int)$totalUsers,
            "totalDocuments" => (int)$totalDocuments,
            "pendingValidations" => (int)$pendingValidations,
            "validatedDocuments" => (int)$validatedDocuments,
            "rejectedDocuments" => (int)$rejectedDocuments,
            "diplomas" => [
                "total" => (int)$diplomaStats['total'],
                "pending" => (int)$diplomaStats['pending'],
                "validated" => (int)$diplomaStats['validated'],
                "rejected" => (int)$diplomaStats['rejected']
            ],
            "certificates" => [
                "total" => (int)$certificateStats['total'],
                "pending" => (int)$certificateStats['pending'],
                "validated" => (int)$certificateStats['validated'],
                "rejected" => (int)$certificateStats['rejected']
            ]
        ]
    ];

    echo json_encode($response);
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

