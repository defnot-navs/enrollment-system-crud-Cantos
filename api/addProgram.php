<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["program_id"], $data["program_name"], $data["ins_id"])) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO program_tbl (program_id, program_name, ins_id) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([
            $data["program_id"],
            $data["program_name"],
            $data["ins_id"]
        ]);

        $response["success"] = true;
        $response["message"] = "Program added successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Insert failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
