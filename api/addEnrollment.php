<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

// Only insert valid values
if (isset($data["student_id"], $data["subject_id"], $data["program_id"])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO enrollments (student_id, subject_id, program_id) VALUES (?, ?, ?)");
        $stmt->execute([
            $data["student_id"],
            $data["subject_id"],
            $data["program_id"]
        ]);

        $response["success"] = true;
        $response["message"] = "Enrollment added successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Insert failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
