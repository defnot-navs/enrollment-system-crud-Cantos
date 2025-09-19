<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["stud_id"])) {
    try {
        $stmt = $pdo->prepare("DELETE FROM student_tbl WHERE stud_id=?");
        $stmt->execute([$data["stud_id"]]);

        $response["success"] = true;
        $response["message"] = "Student deleted successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Delete failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>