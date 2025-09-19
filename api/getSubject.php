<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$response = ["success" => false, "subjects" => []];

try {
    $sql = "SELECT s.subject_id, s.subject_name, s.sem_id, sem.sem_name,
                   s.year_id, CONCAT(y.year_from, '-', y.year_to) AS year_range
            FROM subject_tbl s
            LEFT JOIN semester_tbl sem ON s.sem_id = sem.sem_id
            LEFT JOIN year_tbl y ON s.year_id = y.year_id
            ORDER BY s.subject_id ASC";
    $stmt = $pdo->query($sql);
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($subjects) {
        $response["success"] = true;
        $response["subjects"] = $subjects;
    } else {
        $response["message"] = "No subjects found.";
    }
} catch (PDOException $e) {
    $response["message"] = "SQL Error: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
