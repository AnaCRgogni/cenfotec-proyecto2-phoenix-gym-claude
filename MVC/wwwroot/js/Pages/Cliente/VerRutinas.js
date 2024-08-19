var isValid = true;
var dataTable;
var dataTableIsInitialized = false;
var API_URL_BASE = "https://localhost:7053/api";


function formatFecha(fecha) {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

window.addEventListener("load", async () => {
    await initDataTableRutinas();
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
                    title: 'Error!',
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
            const result = await response; //.json();
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
            confirmButtonColor: '#ff8000' // Color naranja personalizado
        });
    }
};
function showUserProfileModal(id) {
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
                confirmButtonText: 'Cerrar'
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los sets:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener la información de los sets. Intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    });
}
const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: "_all" }, // aca centra las columnas
        { orderable: false, targets: [3] }, // aca establece la columna numero X no va a poder ser usada para ordenar los datos
        { searchable: false, targets: [3] } // aca establece la columna numero X no va a poder ser usada para filtrar los datos
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
function copytoTraining(id,nombre) {
    let setsHtml = '';
    const cedula = sessionStorage.getItem('cedula');
    fecha = getFormattedDateForSQL();
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
                         <div class="set">
                            <input type="hidden" class="id-ejercicio" value="${set.idEjercicios}" />
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="sets">Sets</label>
                                        <input type="number" class="form-control num-sets"/>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="weight">Peso (kg)</label>
                                        <input type="number" class="form-control peso"/>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="time">Tiempo (min)</label>
                                        <input type="number" class="form-control tiempo"/>
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
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                allowOutsideClick: false, // Impide cerrar haciendo clic fuera del modal
                allowEscapeKey: false, // Impide cerrar con la tecla Esc
                preConfirm: () => {

                    var sets = [];
                    $('.set').each(function () {
                        var inputSet = $(this).find('.num-sets').val().trim();
                        var inputWeight = $(this).find('.peso').val().trim();
                        var inputTime = $(this).find('.tiempo').val().trim();

                        if (!validateText(inputSet, $(this).find('.num-sets'))) {
                            isValid = false;
                        }

                        if (!validateText(inputWeight, $(this).find('.peso'))) {
                            isValid = false;
                        }

                        if (!validateText(inputTime, $(this).find('.tiempo'))) {
                            isValid = false;
                        }

                        if (isValid) {
                            var set = {
                                id: 0,
                                rutinaID: 0,
                                numSets: parseInt($(this).find('.num-sets').val().trim()) || 0,
                                peso: parseFloat($(this).find('.peso').val().trim()) || 0,
                                tiempo: parseFloat($(this).find('.tiempo').val().trim()) || 0,
                                ejercicio: {
                                    id: $(this).find('.id-ejercicio').val(),
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

                    const data = {
                        id: 0,
                        name: ("Entrenamiento-"+nombre),
                        fecha: fecha,
                        idCliente: cedula, // Aquí se colocaría el IDcliente
                        sets: sets // Aquí se ingresa la lista de sets
                    };

                    if (isValid) {
                        createEntrenamiento(data);
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pueden enviar datos vacíos.',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000',
                        });
                    }
                    
                }

            });
        },

        error: function (xhr, status, error) {
            console.error('Error al obtener los sets:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener la información de los sets. Intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    });

}
function shareTrainingModal(id) {
    alert(id)
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
const initDataTableRutinas = async () => {
    const cedula = sessionStorage.getItem('cedula');

    try {
        if (dataTableIsInitialized) {
            dataTable.destroy(); // Destroy existing DataTable instance
        }

        const response = await fetch(API_URL_BASE + `/Cliente/GetRutinasById?cedula=${encodeURIComponent(cedula)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        const columns = [
            { data: 'id' },
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
                        <button class="btn btn-orange" onclick="copytoTraining('${row.id}', '${row.nombre}')" id="viewBtn">
                            Usar
                        </button>
                        <button class="btn btn-orange" onclick="showUserProfileModal('${row.id}')" id="viewBtn">
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
            confirmButtonText: 'Ok'
        });
    }
}; 