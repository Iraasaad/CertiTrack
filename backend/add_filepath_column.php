<?php
header("Content-Type: text/plain");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Certitrack";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql1 = "SHOW COLUMNS FROM diplomas LIKE 'pdfFile'";
$result1 = $conn->query($sql1);
if ($result1->num_rows == 0) {
    $alterSql1 = "ALTER TABLE diplomas ADD COLUMN pdfFile VARCHAR(255)";
    if ($conn->query($alterSql1) === TRUE) {
        echo "pdfFile column added to diplomas table successfully\n";
    } else {
        echo "Error adding pdfFile column to diplomas table: " . $conn->error . "\n";
    }
} else {
    echo "pdfFile column already exists in diplomas table\n";
}

$sql2 = "SHOW COLUMNS FROM certificates LIKE 'pdfFile'";
$result2 = $conn->query($sql2);
if ($result2->num_rows == 0) {
    $alterSql2 = "ALTER TABLE certificates ADD COLUMN pdfFile VARCHAR(255)";
    if ($conn->query($alterSql2) === TRUE) {
        echo "pdfFile column added to certificates table successfully\n";
    } else {
        echo "Error adding pdfFile column to certificates table: " . $conn->error . "\n";
    }
} else {
    echo "pdfFile column already exists in certificates table\n";
}

$conn->close();
echo "Database update completed.";
?>

