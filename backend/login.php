<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}


$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "certitrack";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit;
}

$email = $conn->real_escape_string($data['email']);

$sql = "SELECT id, name, email, password, role FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($data['password'], $user['password'])) {
    unset($user['password']);
    
    echo json_encode([
        "success" => true, 
        "message" => "Login successful",
        "user" => $user
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
}

$conn->close();
?>