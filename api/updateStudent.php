<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["stud_id"], $data["first_name"], $data["last_name"], $data["middle_initial"], $data["program_id"], $data["allowance"])) {
    try {
        $stmt = $pdo->prepare("UPDATE student_tbl 
                               SET first_name = ?, last_name = ?, middle_initial = ?, program_id = ?, allowance = ? 
                               WHERE stud_id = ?");
        $stmt->execute([$data["first_name"], $data["last_name"], $data["middle_initial"], $data["program_id"], $data["allowance"], $data["stud_id"]]);

        $response["success"] = true;
        $response["message"] = "Student updated successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Update failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
