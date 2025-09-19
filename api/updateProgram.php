<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["program_id"], $data["program_name"], $data["ins_id"])) {
    try {
        $stmt = $pdo->prepare("UPDATE program_tbl SET program_name=?, ins_id=? WHERE program_id=?");
        $stmt->execute([$data["program_name"], $data["ins_id"], $data["program_id"]]);

        $response["success"] = true;
        $response["message"] = "Program updated successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Update failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>