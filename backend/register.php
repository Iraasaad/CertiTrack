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

if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$name = $conn->real_escape_string($data['name']);
$email = $conn->real_escape_string($data['email']);
$password = password_hash($data['password'], PASSWORD_DEFAULT); 


$checkEmail = "SELECT id FROM users WHERE email = '$email'";
$result = $conn->query($checkEmail);

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit;
}


$sql = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        "success" => true, 
        "message" => "Registration successful",
        "user" => [
            "id" => $conn->insert_id,
            "name" => $name,
            "email" => $email,
            "role" => "user"
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$conn->close();
?>