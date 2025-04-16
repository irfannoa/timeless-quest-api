<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$userId = $_SESSION['user_id'];

require 'db.php'; // your database connection

$sql = "SELECT p.name, p.image, c.quantity, p.price
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $userId); // UUIDs are strings
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $row['price'] = (float)$row['price'];
    $row['quantity'] = (int)$row['quantity'];
    $items[] = $row;
}

echo json_encode($items);