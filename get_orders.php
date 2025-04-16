<?php
require 'db.php';

try {
    $stmt = $conn->query("SELECT * FROM orders ORDER BY created_at DESC");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>