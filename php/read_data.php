<?php

error_reporting(0);
header('Content-type: application/json; charset=utf-8');

function dates_format($fecha){
    $timestamp = strtotime($fecha);
    $months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    $day = date('d', $timestamp);
    $month = date('m', $timestamp) - 1;
    $year = date('Y', $timestamp);
    $hour = date('g', $timestamp);
    $minutes = date('i', $timestamp);
    $meridiem = date('A', $timestamp);

    $fecha = "$day de $months[$month] del $year - $hour:$minutes $meridiem";
    return $fecha;
}

$conexion = new mysqli('localhost', 'root', '', 'todo_list');

if($conexion->connect_errno){   
    $response = ['error' => true];
} else {
    $conexion->set_charset('utf8');
    $query = $conexion->prepare('SELECT * FROM notes ORDER BY id DESC');
    $query->execute();
    $result = $query->get_result();

    $response = [];

    while ($row = $result->fetch_assoc()) {
        $note = [
            'id'        => $row['id'],
            'title'     => $row['title'],
            'text'      => nl2br($row['text']),
            'date'      => dates_format($row['date']),
            'edited'    => $row['edited']
        ];
        array_push($response, $note);
    }
}

echo json_encode($response);

?>
