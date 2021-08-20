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

$note_title = $_POST['title'];
$note_text = $_POST['text'];

$note_bgcolor = $_POST['background'];
$note_bordercolor = $_POST['border'];

$note_title = clean_data($note_title);
$note_text = clean_data($note_text);

function info_validate($note_title, $note_text){
    if ($note_title == '') {
        return false;
    } elseif($note_text == ''){
        return false;
    }
    return true;
}

if (info_validate($note_title, $note_text)) {
    $conexion = new mysqli('localhost', 'root', '', 'todo_list');
    $conexion->set_charset('utf8');

    if ($conexion->connect_errno) {
        $response = ['error' => true, 'errorType' => 'Conexion'];
    } else {
        $query = $conexion->prepare('INSERT INTO notes(title, text, bg_color, border_color) VALUES(?,?,?,?)');
        $query->bind_param('ssss', $note_title, $note_text, $note_bgcolor, $note_bordercolor);
        $query->execute();
    
        if ($conexion->affected_rows <= 0) {
            $response = ['error' => true, 'errorType' => 'Affected_Rows'];
        }
        
        $response = ['error' => false];
    }

} else {
    $response = ['error' => true, 'errorType' => 'Data Validate', 'title' => "$note_title", 'text' => "$note_text"];
}

echo json_encode($response);

?>