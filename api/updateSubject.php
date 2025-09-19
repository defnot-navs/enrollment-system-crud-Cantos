<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$response = ["success" => false];

if (isset($data["subject_id"], $data["subject_name"], $data["sem_id"], $data["year_id"])) {
    try {
        $stmt = $pdo->prepare("UPDATE subject_tbl 
                               SET subject_name = ?, sem_id = ?, year_id = ?
                               WHERE subject_id = ?");
        $stmt->execute([$data["subject_name"], $data["sem_id"], $data["year_id"], $data["subject_id"]]);

        $response["success"] = true;
        $response["message"] = "Subject updated successfully!";
    } catch (PDOException $e) {
        $response["message"] = "Update failed: " . $e->getMessage();
    }
} else {
    $response["message"] = "Invalid input.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
