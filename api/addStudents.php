<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

// Check all required fields including stud_id
if (isset($data["stud_id"], $data["first_name"], $data["last_name"], $data["middle_initial"], $data["program_id"], $data["allowance"])) {
    try {
        // Optional: Check if stud_id already exists to avoid duplicate key error
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM student_tbl WHERE stud_id = ?");
        $checkStmt->execute([$data["stud_id"]]);
        if ($checkStmt->fetchColumn() > 0) {
            $response["message"] = "Student ID already exists.";
            echo json_encode($response, JSON_PRETTY_PRINT);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO student_tbl (stud_id, first_name, last_name, middle_initial, program_id, allowance) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data["stud_id"],
            $data["first_name"],
            $data["last_name"],
            $data["middle_initial"],
            $data["program_id"],
            $data["allowance"]
        ]);

        $response["success"] = true;
        $response["message"] = "Student added successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Insert failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input. Required fields: stud_id, first_name, last_name, middle_initial, program_id, allowance.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
