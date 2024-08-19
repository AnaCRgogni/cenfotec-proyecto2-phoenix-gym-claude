var dataTable;
var dataTableIsInitialized = false;
var API_URL_BASE = "https://localhost:7053/api";

window.addEventListener("load", async () => {
    await initDataTableMembresias();
});

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
        zeroRecords: "Ninguna membresia creada",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ninguna membresia encontrada",
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

function UpdateMembership(id) {
    let html = `
    <div class="form-container">
        <form id="formMembresia" class="needs-validation justify-content-center" novalidate>
            <div class="column">
                <div class="form-group">
                    <label for="updateTipo">Tipo</label>
                    <input type="text" class="form-control" id="updateTipo" required />
                </div>
                <div class="form-group">
                    <label for="updateMensualidad">Mensualidad</label>
                    <input type="number" class="form-control" id="updateMensualidad" required />
                </div>
                <div class="form-group">
                    <label for="updateMatricula">Matricula</label>
                    <input type="number" class="form-control" id="updateMatricula" required />
                </div>
            </div>
        </form>
    </div>
    `;

    $.ajax({
        url: `${API_URL_BASE}/Mensualidad/GetMembresiaByid?id=${id}`,
        method: 'GET',
        success: function (membresia) {
            isValid = true;
            Swal.fire({
                title: 'Membresia',
                html: html,
                showCancelButton: true,
                confirmButtonText: 'Actualizar',
                confirmButtonColor: '#ff8000',
                didOpen: () => {
                    // Llenar los valores del formulario con los datos obtenidos
                    $('#updateTipo').val(membresia.tipo.toString());
                    $('#updateMensualidad').val(membresia.mensualidad.toString());
                    $('#updateMatricula').val(membresia.matricula.toString());
                },
                preConfirm: () => {
                    //Preconfirm, hace antes de seguir la funcion de confirm empieze
                    const tipo = $('#updateTipo').val();
                    const mensualidad = $('#updateMensualidad').val();
                    const matricula = $('#updateMatricula').val();

                    if (tipo === '') {
                        $('#updateTipo').addClass('is-invalid');
                        isValid = false;
                    } else {
                        $('#updateTipo').addClass('is-valid');
                    }

                    if (mensualidad === '') {
                        $('#updateMensualidad').addClass('is-invalid');
                        isValid = false;
                    } else {
                        $('#updateMensualidad').addClass('is-valid');
                    }

                    if (matricula === '') {
                        $('#updateMatricula').addClass('is-invalid');
                        isValid = false;
                    } else {
                        $('#updateMatricula').addClass('is-valid');
                    }

                    if (isValid) {
                        return { tipo, mensualidad, matricula }; 
                    } else {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }
                   
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const { tipo, mensualidad, matricula } = result.value;
                    var updatedMensualidad = {}
                    updatedMensualidad.id = membresia.id;
                    updatedMensualidad.tipo = tipo;
                    updatedMensualidad.mensualidad = mensualidad;
                    updatedMensualidad.matricula = matricula;

                    $.ajax({
                        url: `${API_URL_BASE}/Mensualidad/UpdateMembresia`,
                        method: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(updatedMensualidad),
                        success: function (response, textStatus, xhr) {
                            if (xhr.responseJSON.statusCode === '400') {
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Error al actualizar',
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                    confirmButtonColor: '#ff8000'
                                });
                            } else { 
                                Swal.fire({
                                    title: 'Éxito',
                                    text: 'Mensualidad Actualizada',
                                    icon: 'success',
                                    confirmButtonText: 'Ok',
                                    confirmButtonColor: '#ff8000'
                                }).then(() => {
                                    location.reload();
                                });
                                
                            }
                        }
                    })
                }
            });
        }
    });
}

function DeleteMembresia(id) {
    Swal.fire({
        title: "Desea eliminar de forma permanente esta membresía",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff8000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                url: `${API_URL_BASE}/Mensualidad/DeleteMembresia?id=${id}`,
                method: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Membresía eliminada.',
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
                        text: 'Error al eliminar membresía.',
                        icon: 'erro',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
        }
    });
}

const initDataTableMembresias = async () => {
    try {
        if (dataTableIsInitialized) {
            dataTable.destroy(); // Destroy existing DataTable instance
        }
        const response = await fetch(API_URL_BASE + `/Mensualidad/GetAllMembresias`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(JSON.stringify(data));

        const columns = [
            { data: 'tipo' },
            { data: 'mensualidad' },
            { data: 'matricula' },
            {
                data: null,
                render: function (data, type, row) { 
                    return `
                    <div id="groupBtn">
                        <button class="btn btn-orange" onclick="UpdateMembership('${row.id}')" id="updateBtn">
                            Actualizar
                        </button>
                        <button class="btn btn-orange" onclick="DeleteMembresia(${row.id})" id="deleteBtn">
                                Eliminar
                        </button>
                    <div/>
                    `;
                }
            }
        ];

        dataTable = $("#datatable_membresias").DataTable({
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

$(document).ready(function () {
    $('#formMembresia').submit(async function (event) {
        event.preventDefault(); // Prevent the default form submission
        var isValid = true;
        $(".form-control").removeClass("is-invalid").removeClass("is-valid");
        var tipo = $("#tipo").val().trim();
        var mensualidad = $("#mensualidad").val().trim();
        var matricula = $("#matricula").val().trim();
        var membresia = {}
        membresia.tipo = tipo;
        membresia.mensualidad = mensualidad;
        membresia.matricula = matricula;

        if (tipo === '') {
            $('#tipo').addClass('is-invalid');
            isValid = false;
        } else {
            $('#tipo').addClass('is-valid');
        }
        if (mensualidad === '') {
            $('#mensualidad').addClass('is-invalid');
            isValid = false;
        } else {
            $('#mensualidad').addClass('is-valid');
        }

        if (matricula === '') {
            $('#matricula').addClass('is-invalid');
            isValid = false;
        } else {
            $('#matricula').addClass('is-valid');
        }

        if (isValid) {
            $.ajax({
                url: `${API_URL_BASE}/Mensualidad/CreateMensualidad`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(membresia),
                success: function () {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Mensualidad Creada.',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    }).then(() => {
                        location.reload();
                    });
                },
                error: function () {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear membresia.',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
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