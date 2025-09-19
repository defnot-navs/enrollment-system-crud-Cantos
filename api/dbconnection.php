<?php
// Database connection using PDO

$host = "localhost";     // MySQL server (XAMPP default: localhost)
$dbname = "cantos_enrollment";  // your database name (imported from enrollment.sql)
$username = "root";      // default XAMPP MySQL username
$password = "";          // default XAMPP MySQL password is empty

try {
    // Create PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    // Set PDO to throw exceptions when errors occur
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    // Return error as JSON if connection fails
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
    exit; // stop script execution
}
?>