<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["subject_id"], $data["subject_name"], $data["sem_id"], $data["year_id"])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO subject_tbl (subject_id, subject_name, sem_id, year_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data["subject_id"],
            $data["subject_name"],
            $data["sem_id"],
            $data["year_id"]
        ]);

        $response["success"] = true;
        $response["message"] = "Subject added successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Insert failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
