<?php

error_reporting(0);
header('Content-type: application/json; charset=utf-8');

function clean_data($data) {
    $data = trim($data);
    $data = htmlspecialchars($data);
    $data = stripcslashes($data);
    $data = filter_var($data, FILTER_SANITIZE_STRING);
    return $data;
}

$id = $_POST['id'];
$note_title = $_POST['title'];
$note_text = $_POST['text'];
$edited = 1;

$note_title = clean_data($note_title);
$note_text = clean_data($note_text);

function info_validate($note_title, $note_text, $id){
    if ($note_title == '') {
        return false;
    } elseif($note_text == ''){
        return false;
    } elseif(empty($id)){
        return false;
    }

    return true;
}

if (info_validate($note_title, $note_text, $id)) {
    $conexion = new mysqli('localhost', 'root', '', 'todo_list');
    $conexion->set_charset('utf8');

    if ($conexion->connect_errno) {
        $response = ['error' => true, 'errorType' => 'Conexion'];
    } else {
        $query = $conexion->prepare('UPDATE notes SET title = ?, text = ?, edited = ? WHERE id = ?');
        $query->bind_param('ssii', $note_title, $note_text, $edited, $id);
        $query->execute();
    
        if ($conexion->affected_rows < 0) {
            $response = ['error' => true, 'errorType' => 'Affected_Rows'];
        }
    
        $response = ['error' => false];
    }
    // if ($conexion->connect_errno) {
    //     $response = ['error' => true, 'errorType' => 'Conexion'];
    // } else {
    //     $idQuery = $conexion->prepare('SELECT * FROM notes WHERE id = ? LIMIT 1');
    //     $idQuery->bind_param('i', $id);
    //     $result = $idQuery->execute();
    //     // var_dump($result);

    //     if($result){
    //         $query = $conexion->prepare('UPDATE notes SET title = ?, text = ? WHERE id = ?');
    //         $query->bind_param('ssi', $note_title, $note_text, $id);
    //         $query->execute();
        
    //         if ($conexion->affected_rows < 0) {
    //             $response = ['error' => true, 'errorType' => 'Affected_Rows'];
    //         }
        
    //         $response = ['error' => false];
    //     } else {
    //         $response = ['error' => true, 'errorType' => 'Not Id Found', 'id' => "$id"];
    //     }
    // }

} else {
    $response = ['error' => true, 'errorType' => 'Data Validate', 'title' => "$note_title", 'text' => "$note_text", 'id' => "$id"];
}

echo json_encode($response);

?>