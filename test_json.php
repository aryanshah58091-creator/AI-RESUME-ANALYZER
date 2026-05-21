<?php
require 'c:\xampp\htdocs\resume-api\config\database.php';
$db = Database::getInstance()->getConnection();
$stmt = $db->query("SELECT * FROM jobs WHERE status = 'active'");
$jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
$json = json_encode($jobs);
if ($json === false) {
    echo 'JSON Encode Error: ' . json_last_error_msg() . "\n";
} else {
    echo 'Length: ' . strlen($json) . "\n";
}
