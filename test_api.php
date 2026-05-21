<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/jobs';

require 'c:\xampp\htdocs\resume-api\api\jobs.php';
