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

    cedula = sessionStorage.getItem('cedula');
    fecha = getFormattedDateForSQL();

    populateSelectList(); //aqio popula la lista de maquinas para seleccionar una

    const forms = $('.needs-validation'); // Llama a todo lo que tenga la clase needs-validation

    const form = document.getElementById('exerciseForm');

    $('#trainingForm').submit(async function (event) {
        event.preventDefault(); // Previene el envío por defecto del formulario

        let isValid = true;

        $(".form-control").removeClass("is-invalid");
        // Recolecta los datos del formulario

        var name = $("#training-name").val().trim();

        if (validateText(name, '#training-name')) {
            isValid = true;
        } else {
            isValid = false;
        }

        // Gather sets data
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

        // Crea el objeto de datos
        const data = {
            id: 0,
            name: name,
            fecha: fecha,
            idCliente: cedula, // Aquí se colocaría el IDcliente
            sets: sets // Aquí se ingresa la lista de sets
        };

        // Envía los datos a la API
        if (isValid) {
            createEntrenamiento(data);
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
window.addEventListener("load", async () => {
    await initDataTableEntrenamientos();
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
function validateForm() {
    // Agrega la lógica de validación del formulario aquí
    return true;
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
                    title: 'Error 404',
                    text: 'No se encontraron ejercicios en la base de datos.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else if (response.status === 500) {
                Swal.fire({
                    title: 'Error 500',
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
function showRutinaModal(id) {
    let setsHtml = ''; // Inicializar la variable setsHtml

    $.ajax({
        url: `${API_URL_BASE}/Entrenamiento/GetSetsByEntrenamiento?id=${encodeURIComponent(id)}`,
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
                title: 'Entrenamiento',
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
}

function removeShare(idEntrenamientoCompartido) {
    $.ajax({
        url: `${API_URL_BASE}/Entrenamiento/DeleteEntrenamientoCompartido?id=${idEntrenamientoCompartido}`,
        type: 'DELETE',
        success: function (response) {
            Swal.fire({
                title: 'Éxito',
                text: 'Entrenamiento desvinculado',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        },
        error: function (error) {
            Swal.fire({
                title: 'Error',
                text: 'Error al dejar de compartir',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }
    });
}

function shareTraining(id) {
    let cedulaUsuario = $('#trainer').val();

    const entrenamientoCompartido = {
        idEntrenamiento: id,
        cedulaCliente: cedula,
        cedulaUsuario: cedulaUsuario, // Aquí se colocaría el IDcliente
    };

    //Meto logica de tabla compartir
    $.ajax({
        url: `${API_URL_BASE}/Entrenamiento/CompartirEntrenamiento`,
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(entrenamientoCompartido),
        success: function (response, textStatus, xhr) {
            if (xhr.responseJSON.statusCode === '200') {

                Swal.fire({
                    title: 'Éxito',
                    text: 'Entrenamiento compartido con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });


            } else if (xhr.responseJSON.statusCode === '401') {
                Swal.fire({
                    title: 'Error',
                    text: 'Este entrenamiento ya fue compartido con el entrenador.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
       
    });
}

function getRowsData(entrenamientosCompartidos) {
    let deferreds = []; // Guarda promesas de ajax 
    let rowsHtml = ''; // coleccion de filas

    entrenamientosCompartidos.forEach(entrenamientoCompartido => {

        let deferred = $.ajax({
            url: `${API_URL_BASE}/User/GetUserNameByCedula?cedula=${entrenamientoCompartido.cedulaUsuario}`,
            type: 'GET',
            success: function (user) {
                // crea la fila con los datos del usuario
                let fila = `
                    <tr>
                        <td>${user.nombre}</td>
                        <td>${user.apellido1}</td>
                        <td>
                            <button class="btn btn-orange" onclick="removeShare(${entrenamientoCompartido.id})">
                                <i class="fa-solid fa-xmark fa-lg" id="unshareBtn"></i>
                            </button>
                        </td>
                    </tr>
                `;

                // agrega la fila generada a la colección de filas
                rowsHtml += fila;
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error cargando los datos de usuario.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error cargando usuario.', error);
            }
        });

        deferreds.push(deferred); //guarda promesa en array promesas
    });

    // Espera a que todas las solicitudes AJAX terminen
    $.when.apply($, deferreds).then(function () {
        // Actualiza el tbody con las filas guardadas
        $('#entrenamientosCompartidos').html(rowsHtml);
    });
}

function shareTrainingModal(id) {
    let compartirHtml = '';
    let rol = 'Entrenador';
    function loadEntrenamientosCompartidos() {
        $.ajax({
            url: `${API_URL_BASE}/Cliente/getEntrenamientosCompartidoById?cedula=${cedula}&id=${id}`,
            type: 'GET',
            success: function (entrenamientosCompartidos) {
                getRowsData(entrenamientosCompartidos);  
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error cargando los entrenamientos compartidos.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error cargando entrenadores.', error);
            }
        });
    }

    function loadTrainers() {
        $.ajax({
            url: `${API_URL_BASE}/Entrenador/GetEntrenadores?rolUsuario=${rol}`,
            type: 'GET',
            success: function (data) {
                let trainerOptions = data.map(trainer => {
                    let nombreCompleto = `${trainer.nombre} ${trainer.apellido1} ${trainer.apellido2}`;
                    return `<option value="${trainer.cedula}">${nombreCompleto}</option>`;
                });
                $('#trainer').html(trainerOptions.join(''));
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error', 
                    title: 'Error',
                    text: 'Error cargando entrenadores.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error cargando entrenadores.', error);
            }
        });
    }

    loadTrainers();
    loadEntrenamientosCompartidos();

    compartirHtml += `
        <div>
        <h2>Compartidos</h2>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
              <th scope="col">Eliminar</th>
            </tr>
          </thead>
          <tbody id="entrenamientosCompartidos" >
          </tbody>
        </table>
    </div>
    <div>
        <h2>Compartir</h2>
        <div class="input-group" id="inputShare">
              <label for="trainer">Entrenador:</label>
              <select id="trainer"></select>
              <button class="btn btn-orange" onclick="shareTraining(${id})">
                    Compartir
              </button>
         </div>
    </div>

    `;
    Swal.fire({
        width: "60%",
        html: compartirHtml,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ff8000',
    });
}
async function createEntrenamiento(data) {
    try {
        const response = await fetch(`${API_URL_BASE}/Entrenamiento/CreateEntrenamiento`, {
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
                    text: 'Un entrenamiento con este número ya existe.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else if (response.status === 500) {
                Swal.fire({
                    title: 'Error 500',
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
            const result = await response; 
            console.log('Success:', result);

            Swal.fire({
                title: 'Entrenamiento creado con éxito.',
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
            text: 'Se produjo un error al crear el entrenamiento.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000' 
        });
    }
};

function deleteRutina(id) {
    Swal.fire({
        title: "¿Desea eliminar de forma permanente este entrenamiento?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff8000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Borrar"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                url: `${API_URL_BASE}/Entrenamiento/DeleteEntrenamiento?id=${id}`,
                type: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Entrenamiento eliminado.',
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
                        text: 'Error al eliminar entrenamiento.',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
        }
    });
}
const initDataTableEntrenamientos = async () => {
    const cedula = sessionStorage.getItem('cedula');
    try {
        if (dataTableIsInitialized) {
            dataTable.destroy(); // Destroy existing DataTable instance
        }

        const response = await fetch(API_URL_BASE + `/Cliente/GetEntrenamientosById?cedula=${encodeURIComponent(cedula)}`, {
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
                        <button class="btn btn-orange" onclick="showRutinaModal('${row.id}')" id="viewBtn">
                            <i class="fa-solid fa-user"></i> Ver
                        </button>
                        <button class="btn btn-orange" onclick="shareTrainingModal('${row.id}')" id="shareBtn">
                            Compartir
                        </button>
                        <button class="btn btn-sm btn-danger-delete" onclick="deleteRutina('${row.id}')" data-id="$.${row.id}">
                            <i class="fa-solid fa-xmark fa-lg" id="deleteBtn"></i>
                        </button>
                    <div/>
                    `;
                }
            }
        ];

        dataTable = $("#datatable_entrenamiento").DataTable({
            data: data,
            columns: columns,
            ...dataTableOptions
        });

        dataTableIsInitialized = true;

    } catch (ex) {
        console.error('Error initializing DataTable:', ex);
        Swal.fire({
            title: 'Error',
            text: 'Error al inicializar la tabla de rutinas.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
};