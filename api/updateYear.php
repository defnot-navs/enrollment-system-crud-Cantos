<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["year_id"], $data["year_from"], $data["year_to"])) {
    try {
        $stmt = $pdo->prepare("UPDATE year_tbl SET year_from = ?, year_to = ? WHERE year_id = ?");
        $stmt->execute([$data["year_from"], $data["year_to"], $data["year_id"]]);

        $response["success"] = true;
        $response["message"] = "Year updated successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Update failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
