<?php
header('Content-Type: application/json');
require_once 'dbconnection.php';

$response = ["success" => false, "years" => []];

try {
    $sql = "SELECT year_id, year_from, year_to FROM year_tbl ORDER BY year_id ASC";
    $stmt = $pdo->query($sql);
    $years = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($years) {
        $response["success"] = true;
        $response["years"] = $years;
    } else {
        $response["message"] = "No years found.";
    }
} catch (PDOException $e) {
    $response["message"] = "SQL Error: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>