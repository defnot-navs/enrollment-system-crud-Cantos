<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["sem_id"], $data["sem_name"])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO semester_tbl (sem_id, sem_name) VALUES (?, ?)");
        $stmt->execute([$data["sem_id"], $data["sem_name"]]);

        $response["success"] = true;
        $response["message"] = "Semester added successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Insert failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
