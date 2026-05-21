<?php
session_start();
$_SESSION = [];
session_destroy();
header('Location: recruiter-login.php');
exit();
?>
