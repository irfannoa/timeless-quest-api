<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['amount']) || !isset($data['order_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required data']);
    exit;
}

$amountInSen = (int)($data['amount'] * 100);

$postData = [
    'userSecretKey' => '7n87xwhk-f5qz-qjxf-2ilb-ada6kz3oh8fr',
    'categoryCode' => 'zfbble46',
    'billName' => 'Timeless Quest Order',
    'billDescription' => 'Your Order on Timeless Quest',
    'billPriceSetting' => 1,
    'billPayorInfo' => 1,
    'billAmount' => $amountInSen,
    'billReturnUrl' => 'https://timeless-quest.xyz/thank-you',
    'billCallbackUrl' => 'https://timeless-quest.xyz/toyyibpay_callback.php',
    'billExternalReferenceNo' => $data['order_id'],
    'billTo' => $data['name'],
    'billEmail' => $data['email'],
    'billPhone' => $data['phone']
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://dev.toyyibpay.com/index.php/api/createBill');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

if (isset($result[0]['BillCode'])) {
    $billUrl = 'https://dev.toyyibpay.com/' . $result[0]['BillCode'];
    echo json_encode(['billUrl' => $billUrl]);
} else {
    echo json_encode(['error' => 'Failed to create bill']);
}