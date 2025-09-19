<?php
header('Content-Type: application/json');
require_once 'dbconnection.php'; // this defines $pdo

$response = ["success" => false, "programs" => []];

try {
    $stmt = $pdo->query("SELECT program_id, program_name, ins_id FROM program_tbl ORDER BY program_id DESC");
    $programs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($programs) {
        $response["success"] = true;
        $response["programs"] = $programs;
    } else {
        $response["message"] = "No programs found.";
    }

} catch (PDOException $e) {
    $response["message"] = "SQL Error: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>