<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["enrollment_id"], $data["student_id"], $data["subject_id"], $data["program_id"])) {
    try {
        $stmt = $pdo->prepare("
            UPDATE enrollments
            SET student_id = ?, subject_id = ?, program_id = ?
            WHERE enrollment_id = ?
        ");
        $stmt->execute([
            $data["student_id"],
            $data["subject_id"],
            $data["program_id"],
            $data["enrollment_id"]
        ]);

        $response["success"] = true;
        $response["message"] = "Enrollment updated successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Update failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
