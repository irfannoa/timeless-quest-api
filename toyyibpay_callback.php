<?php
require 'db.php'; // make sure this connects to your Supabase-compatible DB

// ToyyibPay sends this callback as POST
$data = $_POST;

// You can optionally log this for testing
file_put_contents("toyyibpay_log.txt", json_encode($data, JSON_PRETTY_PRINT), FILE_APPEND);

$order_id = $data['refno'] ?? null; // 'refno' is the unique ID we passed to ToyyibPay
$payment_status = $data['status'] ?? 'failed'; // '1' = success, '0' = fail
$billcode = $data['billcode'] ?? null;
$billpayment_status = $payment_status === '1' ? 'paid' : 'failed';

if (!$order_id) {
  http_response_code(400);
  echo "Missing order ID.";
  exit;
}

// Update order status in database
try {
    $stmt = $conn->prepare("UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?");
    $stmt->bind_param("ss", $billpayment_status, $order_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo "Callback handled successfully.";
    } else {
        echo "Order not found or no changes made.";
    }
} catch (Exception $e) {
    error_log("Callback error: " . $e->getMessage());
    http_response_code(500);
    echo "Server error.";
}
?>
