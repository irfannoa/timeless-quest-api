<?php
$host = 'db.fbnvobfijhajaafcjvmu.supabase.co';
$port = 5432;
$dbname = 'timeless_quest';
$user = 'irfannoa';
$password = 'timeless@2000';

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
    $conn = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
