<?php
$host = 'db.fbnvobfijhajaafcjvmu.supabase.co';
$port = 5432;
$dbname = 'timeless_quest';
$user = 'irfannoa';
$password = 'timeless@2000';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "✅ Connection successful";
} catch (PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage();
}
?>