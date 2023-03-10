//VARIABLES
const mascota = document.querySelector('#mascota');
const propietario = document.querySelector('#propietario');
const telefono = document.querySelector('#telefono');
const fecha = document.querySelector('#fecha');
const hora = document.querySelector('#hora');
const sintomas = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedor = document.querySelector('#citas');

let editando;

//objeto principal, donde se guardaran los datos ingresados por los inputs
const infoCita = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}



//EVENTOS
eventListeners();
function eventListeners() {
    mascota.addEventListener('blur', datosCita);
    propietario.addEventListener('blur', datosCita);
    telefono.addEventListener('blur', datosCita);
    fecha.addEventListener('blur', datosCita);
    hora.addEventListener('blur', datosCita);
    sintomas.addEventListener('blur', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}


//CLASSES
class Citas{
    constructor(){
        this.citas = [];
    }

    agregarCita(objetoCita){
        this.citas.push(objetoCita);
    }

    borrarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
        ui.mostrarCitas(this.citas);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => {
            if(cita.id === citaActualizada.id){
                return citaActualizada;
            }else{
                return cita;
            }
        });
    }
}

class Ui{
    mostrarAlerta(mensaje, tipo){
        const existe = document.querySelector('.alerta');
        if(existe){
            existe.remove();
        }

        const alerta = document.createElement('div');
        alerta.className = 'alerta text-center text-white py-2 mb-3';
        alerta.textContent = mensaje;

        if(tipo === 'error'){
            alerta.classList.add('bg-danger');
        }else if(tipo === 'eliminada'){
            alerta.classList.add('bg-primary');
        }else{
            alerta.classList.add('bg-success');
        }

        const contenedorAlerta = document.querySelector('.container');
        contenedorAlerta.insertBefore(alerta, document.querySelector('#contenido'));

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    mostrarCitas(citasArray){
        this.limpiarHTML();
        
        citasArray.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const li = document.createElement('li');
            li.className = 'list-unstyled cita border-bottom';
            li.innerHTML = `
                <h2 class="text-capitalize mascota-nombre">${mascota}</h2>
                <p class="text-capitalize"><span>Propietario:</span> ${propietario}</p>
                <p class="text-capitalize"><span>Teléfono:</span> ${telefono}</p>
                <p class="text-capitalize"><span>Fecha:</span> ${fecha}</p>
                <p class="text-capitalize"><span>Hora: </span>${hora}</p>
                <p class="text-capitalize"><span>Síntomas: </span>${sintomas}</p>
            `;
            li.setAttribute('data-id', id);

            const btnEditar = document.createElement('button');
            btnEditar.className = 'btn btn-primary py-2';
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
            <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
          </svg>`

            const btnBorrar = document.createElement('button');
            btnBorrar.className = 'btn btn-danger py-2 ml-2';
            btnBorrar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="9" />
            <path d="M10 10l4 4m0 -4l-4 4" />
          </svg>`

          //funciones de eliminado y editar
          btnBorrar.onclick = () => eliminarCita(id);
          btnEditar.onclick = () => editarCita(cita);
 
    
            li.appendChild(btnEditar);
            li.appendChild(btnBorrar);

            contenedor.appendChild(li);
        });
    }

    limpiarHTML(){
        while(contenedor.firstChild){
            contenedor.removeChild(contenedor.firstChild);
        }
    }
}

//instancio ambas
const adminCitas = new Citas();

const ui = new Ui();



//FUNCIONES
function datosCita(e){
    const inputName = e.target.name;
    const inputValue = e.target.value;

    //una vez que tengo los inputs, guardo los datos ingresados en un objeto
    infoCita[inputName] = inputValue;
}

function nuevaCita(e) {
    e.preventDefault();

    //validar el formulario, preguntando si el objeto donde guardé los values, tiene algo vacío
    if(Object.values(infoCita).includes('')){
        ui.mostrarAlerta('Ningún campo puede estar vacío', 'error');
        return;
    }

    //modo edicion
    if(editando === true){
        ui.mostrarAlerta('Editado correctamente', 'correcto');

        //pasar el objeto de la cita a edicion
        adminCitas.editarCita({...infoCita});


        //devuelvo el texto del submit
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        //quitar modo edicion
        editando = false;
    }else{
        //generarle un id a la cita
        infoCita.id = Date.now();
    
        //si pasa la validacíon, pusheo el objeto con los datos al arreglo de citas.
        adminCitas.agregarCita({...infoCita}); //mando una copia del objeto principal, no el original

        ui.mostrarAlerta('Agregado correctamente', 'correcto');
    }


    //una vez que se agrega la cita, reiniciar el objeto original
    reiniciarObjeto();
    
    formulario.reset();

    //Mostrar la cita en el HTML, le paso adminCitas porque dentro de la funcion, es el unico que hace referencia al array de citas y se puede acceder a traves de ese metodo
    ui.mostrarCitas(adminCitas.citas);
}

function reiniciarObjeto() {
    infoCita.mascota = '';
    infoCita.propietario = '';
    infoCita.telefono = '';
    infoCita.fecha = '';
    infoCita.hora = '';
    infoCita.sintomas = '';
}

function eliminarCita(identificador){
    //eliminar cita
    adminCitas.borrarCita(identificador);

    //mostrar msj
    ui.mostrarAlerta('La cita fué eliminada', 'eliminada');
}

function editarCita(cita) {
    //desestructuro el objeto para obtener de ahi los datos
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    //les escribo a los inputs de vuelta los datos que habia almacenado el objeto
    document.querySelector('#mascota').value = mascota;
    document.querySelector('#propietario').value = propietario;
    document.querySelector('#telefono').value = telefono;
    document.querySelector('#fecha').value = fecha;
    document.querySelector('#hora').value = hora;
    document.querySelector('#sintomas').value = sintomas;

    //llenar el objeto PRINCIPAL de nuevo, ya que ese es el que está validado en el formulario
    infoCita.mascota = mascota;
    infoCita.propietario = propietario;
    infoCita.telefono = telefono;
    infoCita.fecha = fecha;
    infoCita.hora = hora;
    infoCita.sintomas = sintomas;
    infoCita.id = id;

    //cambio el texto de submit mientras se están editando los campos
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}