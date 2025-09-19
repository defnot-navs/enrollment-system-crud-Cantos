<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["year_id"], $data["year_from"], $data["year_to"])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO year_tbl (year_id, year_from, year_to) VALUES (?, ?, ?)");
        $stmt->execute([
            $data["year_id"],
            $data["year_from"],
            $data["year_to"]
        ]);

        $response["success"] = true;
        $response["message"] = "Year added successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Insert failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
