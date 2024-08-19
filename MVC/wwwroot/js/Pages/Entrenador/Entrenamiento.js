let dataTable;
let dataTableIsInitialized = false;
let cedula = sessionStorage.getItem('cedula');

$(document).ready(function () {
   
});

document.addEventListener("DOMContentLoaded", async () => {
    await initDataTableEntrenamientos();
});

function formatFecha(fecha) {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: "_all" },
        { orderable: false, targets: [3] },
        { searchable: false, targets: [3] }
    ],
    pageLength: 5,
    destroy: true,
    language: {
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

function showTrainingModal(id) {
    let setsHtml = '';

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
                                    <label for="exercise-name">Máquina</label>
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

const initDataTableEntrenamientos = async () => {
    try {
        if (dataTableIsInitialized) {
            dataTable.destroy();
        }

        // Obtener los entrenamientos compartidos
        const response = await fetch(API_URL_BASE + `/Entrenador/getEntrenamientosCompartidoById?cedula=${cedula}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let data = await response.json();
        console.log("data: " + JSON.stringify(data));

        // Obtener los nombres de usuario correspondientes
        const userPromises = data.map(async (entrenamientoCompartido) => {
            try {
                const userResponse = await fetch(`${API_URL_BASE}/User/GetUserNameByCedula?cedula=${entrenamientoCompartido.cedulaCliente}`);
                const entrenamientoResponse = await fetch(`${API_URL_BASE}/Entrenamiento/GetEntrenamientoById?id=${entrenamientoCompartido.idEntrenamiento}`);
                const user = await userResponse.json();
                const entrenamiento = await entrenamientoResponse.json();
                return {
                    ...entrenamientoCompartido,
                    userName: user.nombre,
                    userLastName: user.apellido1,
                    fecha: formatFecha(entrenamiento.fecha)
                };
            } catch (error) {
                console.error('Error cargando usuario:', error);
                return {
                    ...entrenamientoCompartido,
                    userName: 'N/A',
                    userLastName: 'N/A'
                };
            }
        });

        data = await Promise.all(userPromises);

        // Configuración de columnas
        const columns = [
            { data: 'userName', title: 'Nombre' },
            { data: 'userLastName', title: 'Apellido' },
            { data: 'fecha', title: 'Fecha' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <div id="groupBtn">
                            <button class="btn btn-orange" onclick="showTrainingModal('${row.idEntrenamiento}')" id="viewBtn">
                                <i class="fa-solid fa-user"></i> Ver
                            </button>
                        </div>
                    `;
                }
            }
        ];

        // Inicializar la DataTable
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
            text: 'Error al iniciar la tabla de rutinas',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
};