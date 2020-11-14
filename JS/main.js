const addNoteBtn = document.querySelector('#btn-addNote');
const noteContainer = document.querySelector('#note-container');
const form = document.getElementById('note-form');

const alertsContainer = document.querySelector('.alerts-container');

let noteTitle = document.getElementById('note-title');
let noteText = document.getElementById('note-text');

const alert = (message) => {
    const div = document.createElement('div');
    div.classList = 'alert alert-danger';
    div.appendChild(document.createTextNode(`${message}`));
    alertsContainer.appendChild(div);
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

// Validacion de los inputs
const titleValidation = function(){
    if (noteTitle.value == null || noteTitle.value.trim() == '') {
        alert('Debes colocar el TITULO de la nota');
        return false;
    } else {
        return true;
    }
}

const textValidation = function(){
    if (noteText.value == null || noteText.value.trim() == '') {
        alert('Debes colocar el TEXTO de la nota');
        return false;
    } else {
        return true;
    }
}

const formValidation = function(){
    titleValidation();
    textValidation();
    
    return (titleValidation() && textValidation()) ? true : false;
}

// Trabajando con AJAX
const addNote = function(e){
    e.preventDefault();

    const request = new XMLHttpRequest();
    request.open('POST', 'php/save_note.php');
    
    let title = noteTitle.value.trim();
    let note = noteText.value.trim();
    
    if (formValidation()) {
        let params = `note-title=${title}&note-text=${note}`;
    
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencode");
    
        request.onload = function(){
            noteTitle.value = '';
            noteText.value = '';
            console.log('OK');
        }

        request.send(params);
    }
}

addNoteBtn.addEventListener('submit', function(e){
    addNote(e);
})