<?php
// Reset password for user
require_once __DIR__ . '/backend/config/config.php';

$email = 'shaharyan251461@gmail.com';
$newPassword = '12345678';

// Hash the password
$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("UPDATE users SET password = ?, role = 'admin' WHERE email = ?");
    $stmt->execute([$hashedPassword, $email]);
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Password updated successfully!\n\n";
        echo "Login Credentials:\n";
        echo "==================\n";
        echo "Email: $email\n";
        echo "Password: $newPassword\n";
        echo "Role: admin\n\n";
        echo "Login at: http://localhost:5173/admin/login\n";
    } else {
        echo "❌ User not found\n";
    }
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
