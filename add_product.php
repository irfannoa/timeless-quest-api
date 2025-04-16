<?php
require 'db.php';

header('Content-Type: application/json');

// Decode JSON payload
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
    !isset($data['name'], $data['price'], $data['image'], 
            $data['description'], $data['quantity'])
) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// Sanitize input (basic level)
$name = trim($data['name']);
$price = floatval($data['price']);
$image = trim($data['image']);
$desc = trim($data['description']);
$qty = intval($data['quantity']);

try {
    // Insert product (letting Supabase/PostgreSQL auto-generate UUID)
    $stmt = $conn->prepare("
        INSERT INTO products (name, price, image, description, quantity, status) 
        VALUES (:name, :price, :image, :desc, :qty, 'active')
    ");

    $stmt->execute([
        ':name'  => $name,
        ':price' => $price,
        ':image' => $image,
        ':desc'  => $desc,
        ':qty'   => $qty
    ]);

    echo json_encode(["message" => "Product added successfully"]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>