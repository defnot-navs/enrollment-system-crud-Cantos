<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (!empty($data['enrollment_id'])) {
    try {
        $sql = "DELETE FROM enrollments WHERE enrollment_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['enrollment_id']]);

        $response["success"] = true;
        $response["message"] = "Enrollment deleted successfully.";
    } catch (PDOException $e) {
        $response["message"] = "SQL Error: " . $e->getMessage();
    }
} else {
    $response["message"] = "Missing enrollment_id.";
}

echo json_encode($response);
