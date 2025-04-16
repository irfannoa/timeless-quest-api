<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($_SESSION['user_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input or user not logged in']);
    exit;
}

require 'db.php';

$orderId = uuid_create(UUID_TYPE_RANDOM); // generate UUID for order

// Insert into `orders`
$stmt = $conn->prepare("INSERT INTO orders (
    order_id, first_name, last_name, phone, email,
    address1, address2, country, state, city, postcode, status, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");

$status = 'pending';

$stmt->bind_param("ssssssssssss",
    $orderId,
    $data['first_name'],
    $data['last_name'],
    $data['phone'],
    $data['email'],
    $data['address1'],
    $data['address2'],
    $data['country'],
    $data['state'],
    $data['city'],
    $data['postcode'],
    $status
);

if (!$stmt->execute()) {
    echo json_encode(['error' => $stmt->error]);
    exit;
}

// Insert each cart item into order_items (make sure `product_id` is UUID)
$itemStmt = $conn->prepare("INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price_each) VALUES (?, ?, ?, ?, ?)");

foreach ($data['cart'] as $item) {
    $orderItemId = uuid_create(UUID_TYPE_RANDOM);
    $itemStmt->bind_param("sssii", $orderItemId, $orderId, $item['product_id'], $item['quantity'], $item['price']);
    $itemStmt->execute();
}

// Optionally clear the cart
$clearCart = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
$clearCart->bind_param("s", $_SESSION['user_id']);
$clearCart->execute();

echo json_encode(['status' => 'success', 'order_id' => $orderId]);