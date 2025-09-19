<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$response = ["success" => false, "enrollments" => []];

try {
    $sql = "
        SELECT e.enrollment_id,
               s.stud_id, CONCAT(s.first_name, ' ', s.last_name) AS student_name,
               sub.subject_id, sub.subject_name,
               p.program_id, p.program_name,
               y.year_id, CONCAT(y.year_from, '-', y.year_to) AS year_range,
               sem.sem_id, sem.sem_name,
               e.enrollment_date
        FROM enrollments e
        LEFT JOIN student_tbl s ON e.student_id = s.stud_id
        LEFT JOIN subject_tbl sub ON e.subject_id = sub.subject_id
        LEFT JOIN program_tbl p ON e.program_id = p.program_id
        LEFT JOIN year_tbl y ON sub.year_id = y.year_id
        LEFT JOIN semester_tbl sem ON sub.sem_id = sem.sem_id
        ORDER BY e.enrollment_id ASC
    ";

    $stmt = $pdo->query($sql);
    $enrollments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($enrollments) {
        $response["success"] = true;
        $response["enrollments"] = $enrollments;
    } else {
        $response["message"] = "No enrollments found.";
    }
} catch (PDOException $e) {
    $response["message"] = "SQL Error: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
