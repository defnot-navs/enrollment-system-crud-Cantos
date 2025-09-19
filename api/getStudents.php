<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$response = ["success" => false, "students" => []];

try {
    $sql = "
        SELECT s.stud_id, s.first_name, s.last_name, s.middle_initial, s.allowance,
               p.program_name
        FROM student_tbl s
        LEFT JOIN program_tbl p ON s.program_id = p.program_id
        ORDER BY s.stud_id ASC
    ";
    $stmt = $pdo->query($sql);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($students) {
        $response["success"] = true;
        $response["students"] = $students;
    } else {
        $response["message"] = "No students found.";
    }

} catch (PDOException $e) {
    $response["message"] = "SQL Error: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
