<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$response = ["success" => false, "semester" => []];

try {
    $sql = "SELECT sem_id, sem_name FROM semester_tbl ORDER BY sem_id ASC";
    $stmt = $pdo->query($sql);
    $semester = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($semester) {
        $response["success"] = true;
        $response["semester"] = $semester;
    } else {
        $response["message"] = "No semesters found.";
    }
} catch (PDOException $e) {
    $response["message"] = "SQL Error: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
