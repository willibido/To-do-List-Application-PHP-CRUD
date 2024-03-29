const addNoteBtn = document.querySelector('#btn-addNote');
const updateBtn = document.querySelector('#edit-btn');
const cancelUpdateBtn = document.querySelector('#cancel-edit-btn');
const btnWrapper = document.querySelector('.edit-btn-wrapper');

let tempId = document.getElementById('tempId');

const noteContainer = document.querySelector('#note-container');
const form = document.getElementById('note-form');

const alertsContainer = document.querySelector('.alerts-container');

let noteTitle = document.getElementById('note-title');
let noteText = document.getElementById('note-text');

const updateNoteBtn = document.getElementById('edit-btn');

const alert = (message, className) => {
    const div = document.createElement('div');
    div.classList = `alert alert-${className}`;
    div.appendChild(document.createTextNode(`${message}`));
    alertsContainer.appendChild(div);
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

const noteColors = [
    {
        background: '#fff1dd',
        border: '#d4a660'
    },
    {
        background: '#CDEEF3',
        border: '#44BCCE'
    },
    {
        background: '#CDF3D8',
        border: '#80BF92'
    },
    {
        background: '#CDD5F3',
        border: '#7D88B2'
    }
];

colorPosition = 0;

document.getElementsByTagName('form')[0].reset();

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
            element.classList = 'note card border-primary mb-3 col-md-12 mr-3 align-self-start';
            
            element.style.background = `${note.bg_color}`;
            element.style.setProperty('border-color', `${note.border_color}`, 'important',);
            
            element.innerHTML = `
                <div class="card-body">
                    <input type="hidden" name="note_id" value="${note.id}">

                    <h3 class="card-title mb-4">${note.title}</h3>
                    <span class="edited-indicator text-muted card-subtitle">
                        ${ note.edited == 1 ? "✔ Editado" : ""}
                    </span>
                    <h6 class="text-muted card-subtitle mb-4">${note.date}</h6>
                    <p class="text">${note.text}</p>
                    
                    <button class="btn btn-primary edit-note">Edit</button>
                    <button class="btn btn-danger delete-note">Delete</button>
                </div>
            `;
            noteContainer.appendChild(element);
        });

        let deleteBtn = document.querySelectorAll('.delete-note');
        let editBtn = document.querySelectorAll('.edit-note');
            
        deleteBtn.forEach(btn => {
            btn.addEventListener('click', function() {
                let id = btn.parentElement.firstChild.nextSibling;
                delete_note(id.value);
            })
        });

        editBtn.forEach(btn => {
            btn.addEventListener('click', function() {
                let id = btn.parentElement.firstChild.nextSibling;
                let parentElement = btn.parentElement;

                let title = parentElement.firstChild.nextSibling.nextSibling.nextSibling;
                let text = parentElement.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;

                if (btnWrapper.classList.contains("hide")) {
                    btnWrapper.classList.remove("hide");
                    addNoteBtn.classList.add('hide');
                }

                noteTitle.value = title.textContent;
                noteText.value = text.textContent;

                tempId.value = id.value;

                deleteBtn.forEach(btn => {
                    btn.classList.add('hiden-btn');
                });
                editBtn.forEach(btn => {
                    btn.classList.add('hiden-btn');
                });
            })
        });
    }

    // Enviamos la peticion al servidor
    request.send();
}

const add_notes = (e, color) => {
    e.preventDefault();
    let noteBG;
    let borderColor;

    console.log(color);

    // Asignar colores
    if (color == 0) {
        noteBG = noteColors[0].background;
        borderColor = noteColors[0].border;

        console.log(noteBG, borderColor);
    } else if (color == 1){
        noteBG = noteColors[1].background;
        borderColor = noteColors[1].border;

        console.log(noteBG, borderColor);
    } else if (color == 2){
        noteBG = noteColors[2].background;
        borderColor = noteColors[2].border;

        console.log(noteBG, borderColor);
    } else if (color == 3){
        noteBG = noteColors[3].background;
        borderColor = noteColors[3].border;

        console.log(noteBG, borderColor);
    } else if (color >= 4) {
        colorPosition = 0;

        noteBG = noteColors[0].background;
        borderColor = noteColors[0].border;
    }

    // Instanciamos el objeto XMLHttpRequest
    const request = new XMLHttpRequest();
    // Abrimos una conexion al archivo que nos devuelve la informacion de la base de datos
    request.open('POST', 'php/add_data.php');

    if (form_validate(noteTitle.value, noteText.value)) {
        let params = `title=${noteTitle.value}&text=${noteText.value}&border=${borderColor}&background=${noteBG}`;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
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

const delete_note = (id) => {
    const request = new XMLHttpRequest();

    request.open('POST', 'php/delete_data.php');

    let params = `id=${id}`;

    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    request.onload = function() {
        let response = JSON.parse(request.responseText);

        if(response.error){
            alert('No se pudo eliminar la nota', 'danger');
        } else {
            noteContainer.innerHTML = '';
            get_notes();
            alert('Nota eliminada satisfactoriamente', 'success');
        }
    }

    request.send(params);
    // console.log(id);
}

const edit_note = () => {
    // console.log(tempId.value);

    // Instanciamos el objeto XMLHttpRequest
    const request = new XMLHttpRequest();
    // Abrimos una conexion al archivo que nos devuelve la informacion de la base de datos
    request.open('POST', 'php/edit_data.php');

    if (form_validate(noteTitle.value, noteText.value)) {
        let params = `title=${noteTitle.value}&text=${noteText.value}&id=${tempId.value}`;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        request.onload = function(){
            let response = JSON.parse(request.responseText);
            
            if (response.error) {
                alert('No se pudo actualizar la informacion', 'danger');
            } else {
                noteContainer.innerHTML = '';
                get_notes();
                alert('Nota actualizada exitasamente', 'success');
                resetForm();
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
    
    add_notes(e, colorPosition);
    colorPosition++;
    console.log(colorPosition);
})

updateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    edit_note();
})

cancelUpdateBtn.addEventListener('click', function(e){
    e.preventDefault();
    resetForm();

    document.querySelectorAll('.delete-note').forEach(btn => {
        btn.classList.remove('hiden-btn');
    });
    document.querySelectorAll('.edit-note').forEach(btn => {
        btn.classList.remove('hiden-btn');
    });
})

const resetForm = () => {
    document.getElementsByTagName('form')[0].reset();
    btnWrapper.classList.add('hide');   
    addNoteBtn.classList.remove('hide');
}

const form_validate = (title, text) => {
    if(title == ''){
        return false;
    } else if(text == ''){
        return false;
    }

    return true;
}