<?php

$conexion = new mysqli('localhost', 'admin', 'admin', 'todolist');
$conexion->set_charset('utf8');

if ($conexion->connect_errno) {
    echo 'ERROR';
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nota = $_POST['nota'];

    $insert = $conexion->prepare('INSERT INTO note(texto) VALUES(?)');
    $insert->bind_param('s', $nota);
    $insert->execute();
}

?>