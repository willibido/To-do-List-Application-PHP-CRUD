<?php

error_reporting(0);
header("Content-type: application/json; charset-utf-8");

// if($_SERVER['REQUEST_METHOD'] == 'POST'){
    
    $note_text = $_POST['note-text'];
    $note_title = $_POST['note-title'];

    function clean_data($data) {
        $data = trim($data);
        $data = htmlspecialchars($data);
        $data = stripcslashes($data);
        $data = filter_var($data, FILTER_SANITIZE_STRING);
        return $data;
    }

    $note_text = clean_data($note_text);
    $note_title = clean_data($note_title);

    $conexion = new mysqli('localhost', 'willicoder', 'ZApKer@m83', );
    $conexion->set_chartser('utf8');

    if ($conexion->connect_errno) {
        $response = ['error' => true];
    } else {
        $query = $conexion->prepare("INSERT INTO notes(title, text) VALUES(?,?)");
        $query->bind_param("ss", $note_title, $note_text);
        $query->execute();

        if ($conexion->affected_rows <= 0){
            $response = ['error' => true];
        }

        $response = [];
    }

// } else {
//     $response = ['error' => true];
// }

echo json_encode($response);

?>