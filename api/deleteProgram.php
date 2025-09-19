<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["program_id"])) {
    try {
        // Optional check: prevent delete if students are enrolled
        $check = $pdo->prepare("SELECT COUNT(*) FROM student_tbl WHERE program_id=?");
        $check->execute([$data["program_id"]]);
        if ($check->fetchColumn() > 0) {
            $response["message"] = "Cannot delete program: students are enrolled in it.";
        } else {
            $stmt = $pdo->prepare("DELETE FROM program_tbl WHERE program_id=?");
            $stmt->execute([$data["program_id"]]);

            $response["success"] = true;
            $response["message"] = "Program deleted successfully!";
        }
    } catch (PDOException $e) {
        $response["message"] = "Delete failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
