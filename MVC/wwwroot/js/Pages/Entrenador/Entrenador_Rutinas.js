
let dataTable;
let dataTableIsInitialized = false;
var API_URL_BASE = "https://localhost:7053/api";
function formatFecha(fecha) {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}
$(document).ready(function () {
    userId = sessionStorage.getItem('cedula');
    fecha = getFormattedDateForSQL();

    console.log(userId + "\n" + fecha);

    populateSelectList(); // Aquí se llena la lista de máquinas para seleccionar una

    const forms = $('.needs-validation'); // Llama a todo lo que tenga la clase needs-validation

    const form = document.getElementById('exerciseForm');

    $('#routineForm').submit(async function (event) {
        event.preventDefault(); // Previene el envío por defecto del formulario

        var isValid = true;

        // Remover clases de validación
        $(".form-control").removeClass("is-invalid is-valid");

        // Recolectar y validar los datos del formulario principal
        var name = $("#routine-name").val().trim();
        var clientId = $("#client-id").val().trim();

        if (!validateText(name, '#routine-name')) {
            isValid = false; altura
        }

        if (!validateText(clientId, '#client-id')) {
            isValid = false;
        }

        // Recolectar y validar los datos de sets
        var sets = [];
        $('.exercise').each(function () {
            var inputSet = $(this).find('.num-sets').val().trim();
            var inputWeight = $(this).find('.peso').val().trim();
            var inputTime = $(this).find('.tiempo').val().trim();
            var inputEjercicio = $(this).find('.ejercicio-name').val().trim();

            if (!validateText(inputSet, $(this).find('.num-sets'))) {
                isValid = false;
            }

            if (!validateText(inputWeight, $(this).find('.peso'))) {
                isValid = false;
            }

            if (!validateText(inputTime, $(this).find('.tiempo'))) {
                isValid = false;
            }

            if (!validateText(inputEjercicio, $(this).find('.ejercicio-name'))) {
                isValid = false;
            }

            // Si es válido, añadir a la lista de sets
            if (isValid) {
                var set = {
                    id: 0,
                    rutinaID: 0,
                    numSets: parseInt(inputSet) || 0,
                    peso: parseFloat(inputWeight) || 0,
                    tiempo: parseFloat(inputTime) || 0,
                    ejercicio: {
                        id: parseInt(inputEjercicio) || 0,
                        name: "n/a",
                        description: "n/a",
                        picturelink: "n/a",
                        maquina: {
                            id: 0,
                            name: "n/a",
                            description: "n/a",
                            picturelink: "n/a"
                        }
                    }
                };
                sets.push(set);
            }
        });

        // Crear el objeto de datos
        const data = {
            id: 0,
            name: name,
            fecha: fecha,
            idUsuario: userId, // Aquí se colocaría el IDusuario
            idCliente: clientId, // Aquí se colocaría el IDcliente
            sets: sets // Aquí se ingresa la lista de sets
        };

        // Enviar los datos a la API
        if (isValid) {
            console.log(JSON.stringify(data, null, 2));
            createRutina(data);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Revise las casillas marcadas en rojo.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000' 
            });
        }
    });
});
window.addEventListener("load", async () => {
    await initDataTableRutinas();
});

function addExercise() {
    const container = document.getElementById('exercises-container');
    const template = document.getElementById('exercise-template');
    const clone = template.cloneNode(true);
    clone.style.display = '';
    clone.id = '';
    container.appendChild(clone);
}

function deleteExercise(button) {
    const exercise = button.closest('.exercise');
    exercise.remove();
}

function validateForm() {
    // Agrega la lógica de validación del formulario aquí
    return true;
}

function selectExercise(input, name) {
    input.value = name;
    input.nextElementSibling.style.display = 'none';
}

async function populateSelectList() {
    const ejercicios = await fetchEjercicios();
    if (Array.isArray(ejercicios)) {
        const selectList = $('#ejercicio-name');

        ejercicios.forEach(ejercicio => {
            const option = $('<option></option>').val(ejercicio.id).text(ejercicio.name);
            selectList.append(option);
        });
    } else {
        console.error('Ejercicios is not an array:', ejercicios);
    }
}

async function fetchEjercicios() {
    try {
        const response = await fetch(`${API_URL_BASE}/Ejercicio/GetAllEjercicios`, { // Obtiene la lista de ejercicios/maquinas para mostrar en las cartas
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se encontraron ejercicios en la base de datos.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
            } else if (response.status === 500) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error interno del servidor.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: `Error HTTP con el estado: ${response.status}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            const result = await response.json();
            console.log('Success:', result);
            return result; // Devuelve los ejercicios obtenidos
        }

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Se produjo un error al obtener los ejercicios.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000' // Color naranja personalizado
        });
    }
}


function validateText(text, elementSelector) { // Se llama así: validateElement(machineName, '#machineName');
    const element = $(elementSelector);

    if (text === '') {
        element.removeClass('is-valid').addClass('is-invalid');
        return false;
    } else {
        element.removeClass('is-invalid').addClass('is-valid');
        return true;
    }
};

function getFormattedDateForSQL() {
    // Fecha de hoy
    let today = new Date();

    //Cambio a formato para sql
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
    let day = String(today.getDate()).padStart(2, '0');

    // Crea la cadena con el formato "YYYY-MM-DD"
    let formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}


async function createRutina(data) {
    try {
        const response = await fetch(`${API_URL_BASE}/Rutina/CreateRutina`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 409) {
                Swal.fire({
                    title: 'Error',
                    text: 'Una rutina con este número ya existe.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
            } else if (response.status === 500) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error interno del servidor.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: `Error HTTP con el estado: ${response.status}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } else {
            const result = await response; //.json();
            console.log('Success:', result);

            Swal.fire({
                title: 'Rutina creada con éxito.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000' 
            }).then(() => {
                location.reload();
            });
        }

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Se produjo un error al crear la rutina.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000' // Color naranja personalizado
        });
    }
};

const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: "_all" }, // aca centra las columnas
        { orderable: false, targets: [2] }, // aca establece la columna numero X no va a poder ser usada para ordenar los datos
        { searchable: false, targets: [2] } // aca establece la columna numero X no va a poder ser usada para filtrar los datos
    ],
    pageLength: 5, // Aca controla la cantidad de datos que se cargan por pagina
    destroy: true,
    language: { // escogencia del idioma
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ninguna rutina creada",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ninguna rutina encontrada",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando... ",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};


function showRoutineModal(id) {
    let setsHtml = ''; // Inicializar la variable setsHtml

    $.ajax({
        url: `${API_URL_BASE}/Rutina/GetSetsByRutina?id=${encodeURIComponent(id)}`,
        method: 'GET',
        success: function (sets) {
            sets.forEach(function (set) {
                setsHtml += `
                    <img src="${set.imagen}" height="auto" width="300px" class="mt-2" />
                    <div id="exercises-container">
                        <div class="exercise" id="exercise-template">
                            <div class="row">
                                <div class="form-group">
                                    <label for="exercise-name">Ejercicio</label>
                                    <input type="text" value="${set.nombre}" disabled/>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group">
                                    <label for="exercise-name">Maquina</label>
                                    <input type="text" value="${set.equipo}" disabled/>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group">
                                    <label for="exercise-name">Descripcion</label>
                                    <p>${set.descripcion}<p/>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="sets">Sets</label>
                                        <input type="number" value="${set.sets}" disabled/>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="weight">Peso (kg)</label>
                                        <input type="number" value="${set.peso}" disabled/>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="time">Tiempo (min)</label>
                                        <input type="number" value="${set.tiempo}" disabled/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Mostrar el modal de SweetAlert con el contenido HTML generado
            Swal.fire({
                title: 'Detalles de la rutina:',
                html: setsHtml,
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#ff8000' 
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los sets:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener la información de los sets. Intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#ff8000' 
            });
        }
    });
};

async function deleteRutina(id) {
    Swal.fire({
        title: "Desea eliminar de forma permanente esta rutina",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff8000",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                url: `${API_URL_BASE}/Rutina/DeleteRutina/${id}`,
                method: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Rutina eliminada.',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    }).then(() => {
                        location.reload(); // Refrescar la ventana después de presionar "Ok"
                    });
                },
                error: function (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al eliminar rutina.',
                        icon: 'erro',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
        }
    });
}


const initDataTableRutinas = async () => {
    const cedula = sessionStorage.getItem('cedula');
    try {
        if (dataTableIsInitialized) {
            dataTable.destroy(); // Destroy existing DataTable instance
        }

        const response = await fetch(API_URL_BASE + `/Entrenador/GetRutinasById?cedula=${encodeURIComponent(cedula)}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        const columns = [
            { data: 'nombre' },
            {
                data: 'fecha',
                render: function (data, type, row) {
                    return formatFecha(data); // Aplica la función para formatear la fecha
                }
            },
            {
                data: null,
                render: function (data, type, row) { // btn-primary boton lleva al perfil del cliente, aun no esta creado el perfil del cliente, esto esta pendiente
                    return `
                    <div id="groupBtn">
                        <button class="btn btn-sm btn-danger-delete" onclick="deleteRutina('${row.id}')" data-id="$.${row.id}">
                            <i class="fa-solid fa-xmark fa-lg" id="deleteBtn"></i>
                        </button>
                        <button class="btn btn-orange" onclick="showRoutineModal('${row.id}')" id="viewBtn">
                            Ver
                        </button>
                    <div/>
                    `;
                }
            }
        ];

        dataTable = $("#datatable_rutinas").DataTable({
            data: data,
            columns: columns,
            ...dataTableOptions
        });

        dataTableIsInitialized = true;

    } catch (ex) {
        console.error('Error initializing DataTable:', ex);
        Swal.fire({
            title: 'Error',
            text: 'Error al iniciar la tabla de rutinas.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000' 
        });
    }
};

