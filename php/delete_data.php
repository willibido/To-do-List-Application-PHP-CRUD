<?php

error_reporting(0);
header('Content-type: application/json; charset=utf-8');

$id = $_POST['id'];

$conexion = new mysqli('localhost', 'willicoder', 'ZApKer@m83', 'todo_list');
$conexion->set_charset('utf8');

if ($conexion->connect_errno) {
    $response = ['error' => true, 'errorType' => 'Conexion'];
} else {
    $query = $conexion->prepare('DELETE FROM notes WHERE id = ?');
    $query->bind_param('i', $id);
    $query->execute();

    if ($conexion->affected_rows <= 0) {
        $response = ['error' => true, 'errorType' => 'Affected_Rows'];
    }
    
    $response = ['error' => false];
}

echo json_encode($response);

?>