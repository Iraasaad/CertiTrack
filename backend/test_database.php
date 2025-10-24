<?php
header("Content-Type: text/plain");
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Certitrack";

echo "Connecting to database...\n";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . "\n");
}
echo "Connected successfully\n\n";

echo "DIPLOMAS TABLE STRUCTURE:\n";
$result = $conn->query("DESCRIBE diplomas");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo $row['Field'] . " - " . $row['Type'] . " - " . ($row['Null'] === "YES" ? "NULL" : "NOT NULL") . "\n";
    }
} else {
    echo "Error getting table structure: " . $conn->error . "\n";
}
echo "\n";

echo "CERTIFICATES TABLE STRUCTURE:\n";
$result = $conn->query("DESCRIBE certificates");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo $row['Field'] . " - " . $row['Type'] . " - " . ($row['Null'] === "YES" ? "NULL" : "NOT NULL") . "\n";
    }
} else {
    echo "Error getting table structure: " . $conn->error . "\n";
}
echo "\n";

echo "SAMPLE DATA FROM DIPLOMAS:\n";
$result = $conn->query("SELECT id, fullName, title, pdfFile FROM diplomas LIMIT 5");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . ", Name: " . $row['fullName'] . ", Title: " . $row['title'] . ", PDF: " . ($row['pdfFile'] ?? 'NULL') . "\n";
    }
} else {
    echo "No data or error: " . $conn->error . "\n";
}
echo "\n";

echo "SAMPLE DATA FROM CERTIFICATES:\n";
$result = $conn->query("SELECT id, fullName, title, pdfFile FROM certificates LIMIT 5");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . ", Name: " . $row['fullName'] . ", Title: " . $row['title'] . ", PDF: " . ($row['pdfFile'] ?? 'NULL') . "\n";
    }
} else {
    echo "No data or error: " . $conn->error . "\n";
}

$conn->close();
echo "\nDatabase connection closed\n";
?>

