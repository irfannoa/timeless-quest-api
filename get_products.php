<?php
require 'db.php';

try {
    $stmt = $conn->query("SELECT * FROM products ORDER BY name ASC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
