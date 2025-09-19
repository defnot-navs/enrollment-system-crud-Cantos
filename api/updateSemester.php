<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["sem_id"], $data["sem_name"])) {
    try {
        $stmt = $pdo->prepare("UPDATE semester_tbl SET sem_name = ? WHERE sem_id = ?");
        $stmt->execute([$data["sem_name"], $data["sem_id"]]);

        $response["success"] = true;
        $response["message"] = "Semester updated successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Update failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
