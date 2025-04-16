<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

try {
    $stmt = $conn->prepare("DELETE FROM products WHERE product_id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Product deleted successfully"]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>