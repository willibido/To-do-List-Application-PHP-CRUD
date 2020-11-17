const addNoteBtn = document.querySelector('#btn-addNote');
const noteContainer = document.querySelector('#note-container');
const form = document.getElementById('note-form');

const alertsContainer = document.querySelector('.alerts-container');

let noteTitle = document.getElementById('note-title');
let noteText = document.getElementById('note-text');

const alert = (message, className) => {
    const div = document.createElement('div');
    div.classList = `alert alert-${className}`;
    div.appendChild(document.createTextNode(`${message}`));
    alertsContainer.appendChild(div);
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

const get_notes = () => {
    // Instanciamos el objeto XMLHttpRequest
    const request = new XMLHttpRequest();
    // Abrimos una conexion al archivo que nos devuelve la informacion de la base de datos
    request.open('GET', 'php/read_data.php');

    // Mediante la funcion onload ejecutamos una funcion por cada respuesta del servidor
    request.onload = function(){
        // Convertimos los datos obtenidos a un objeto JSON median JSON.parse
        let data = JSON.parse(request.responseText);

        // Cada objeto obtenido lo mostramos en pantalla mediante la funcion forEach
        data.forEach(note => {
            const element = document.createElement('div');
            element.classList = 'note card border-primary mb-3 col-md-5 mr-3 align-self-start';
            element.innerHTML = `
                <div class="card-body">
                    <h3 class="card-title">${note.title}</h3>
                    <h6 class="text-muted card-subtitle mb-4">${note.date}</h6>
                    <p class="text">${note.text}</p>
                    <button class="btn btn-primary">Edit</button>
                    <button class="btn btn-danger">Delete</button>
                </div>
            `;
            noteContainer.appendChild(element);
        });
    }

    // Enviamos la peticion al servidor
    request.send();
}

const add_notes = (e) => {
    e.preventDefault();

    // Instanciamos el objeto XMLHttpRequest
    const request = new XMLHttpRequest();
    // Abrimos una conexion al archivo que nos devuelve la informacion de la base de datos
    request.open('POST', 'php/add_data.php');

    if (form_validate(noteTitle.value, noteText.value)) {
        let params = `title=${noteTitle.value}&text=${noteText.value}`;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        // 
        request.onload = function(){
            let response = JSON.parse(request.responseText);
            
            if (response.error) {
                alert('No se pudo guardar la informacion', 'danger');
            } else {
                noteContainer.innerHTML = '';
                get_notes();
                alert('Nota agregada exitasamente', 'success');
                noteTitle.value = '';
                noteText.value = '';
            }
        }
        
        // Enviamos la peticion al servidor
        request.send(params);
    } else {
        alert('Completa los campos del formulario', 'warning');
    }
}

get_notes();

addNoteBtn.addEventListener('click', function(e){
    add_notes(e)
})

const form_validate = (title, text) => {
    if(title == ''){
        return false;
    } else if(text == ''){
        return false;
    }

    return true;
}