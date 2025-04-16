<?php
require_once 'db.php'; // Make sure this contains your Supabase setup

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data["order_id"] ?? null;
$new_status = $data["status"] ?? null;

if (!$order_id || !$new_status) {
    echo json_encode(["error" => "Missing order ID or new status"]);
    exit;
}

// 1. Fetch current status
$response = $supabase->from('orders')->select('status')->eq('order_id', $order_id)->single();

if ($response['error']) {
    echo json_encode(["error" => "Order not found or DB error"]);
    exit;
}

$current_status = strtolower($response['data']['status'] ?? '');

if ($current_status === "completed") {
    echo json_encode(["error" => "Cannot update. Order is already marked as Completed."]);
    exit;
}

// 2. Update status
$update = $supabase
    ->from('orders')
    ->update(['status' => $new_status])
    ->eq('order_id', $order_id);

if ($update['error']) {
    echo json_encode(["error" => "Failed to update order status"]);
} else {
    echo json_encode(["message" => "Order status updated to $new_status"]);
}
?>