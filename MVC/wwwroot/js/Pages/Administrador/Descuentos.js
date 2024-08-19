var dataTable;
var dataTableIsInitialized = false;
var API_URL_BASE = "https://localhost:7053/api";

window.addEventListener("load", async () => {
    await initDataTableDescuentos();
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
        zeroRecords: "Ningun descuento creado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningun descuentp encontrado",
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

function updateDescuento(id) {
    let html = `
        <div class="form-container">
            <form id="formDescuento" class="needs-validation" novalidate>
                <div id="createMembresia">
                    <div class="col-md-6 form-group">
                        <label for="codigo">Código</label>
                        <input type="text" class="form-control" id="updateCodigo" required />
                    </div>
                    <div class="col-md-6 form-group">
                        <label for="porcentaje">Porcentaje</label>
                        <input type="number" class="form-control" id="updatePorcentaje" required />
                    </div>
                    <div class="col-md-6 form-group">
                        <label for="estado">Estado</label>
                        <select class="form-control" id="updateEstado" required>
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    `;

    $.ajax({
        url: `${API_URL_BASE}/Descuento/GetDescuentoByid?id=${id}`, // Corregido
        method: 'GET',
        success: function (descuento) {
            Swal.fire({
                title: 'Actualizar Descuento',
                html: html,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Actualizar',
                confirmButtonColor: '#ff8000',
                didOpen: () => {
                    // Rellenar campos con los valores recibidos
                    $('#updateCodigo').val(descuento.codigo);
                    $('#updatePorcentaje').val(descuento.porcentaje);
                    $('#updateEstado').val(descuento.estado.toString()); // Convertir el booleano a string
                },
                preConfirm: () => {
                    const codigo = $('#updateCodigo').val();
                    const porcentaje = $('#updatePorcentaje').val();
                    const estado = $('#updateEstado').val() === 'true';;
                    let isValid = true;

                    if (codigo =='') {
                        $('#updateCodigo').addClass('is-invalid');
                        isValid = false;
                    } else {
                        $('#updateCodigo').removeClass('is-invalid').addClass('is-valid');
                    }

                    if (porcentaje == '') {
                        $('#updatePorcentaje').addClass('is-invalid');
                        isValid = false;
                    } else {
                        $('#updatePorcentaje').removeClass('is-invalid').addClass('is-valid');
                    }

                    if (isValid) {
                        return { codigo, porcentaje,estado }
                    } else {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const { codigo, porcentaje, estado } = result.value
                    var updatedDescuento = {}
                    updatedDescuento.id = descuento.id;
                    updatedDescuento.codigo = codigo;
                    updatedDescuento.porcentaje = porcentaje;
                    updatedDescuento.estado = estado;
                    console.log(JSON.stringify(updatedDescuento));

                    $.ajax({
                        url: `${API_URL_BASE}/Descuento/UpdateDescuento`,
                        method: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(updatedDescuento),
                        success: function (response, textStatus, xhr) {
                            if (xhr.responseJSON.statusCode === '400') {
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Código en uso',
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                    confirmButtonColor: '#ff8000'
                                });
                            } else {
                                Swal.fire({
                                    title: 'Éxito',
                                    text: 'Descuento Actualizado',
                                    icon: 'success',
                                    confirmButtonText: 'Ok',
                                    confirmButtonColor: '#ff8000'
                                }).then(() => {
                                    location.reload();
                                });
                            }
                        },
                        error: function () {
                            Swal.fire({
                                title: 'Error',
                                text: 'Error al actualizar el descuento',
                                icon: 'error',
                                confirmButtonText: 'Ok',
                                confirmButtonColor: '#ff8000'
                            });
                        }
                    });
                }
            });
        },
        error: function () {
            Swal.fire({
                title: 'Error',
                text: 'Error al obtener el descuento',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }
    });
}

function deleteDescuento(id) {
    Swal.fire({
        title: "Desea eliminar de forma permanente este descuento",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff8000",
        cancelButtonColor: "#d33",
        cancelButtonText:"Cancelar",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                url: `${API_URL_BASE}/Descuento/DeleteDescuento?id=${id}`,
                method: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Descuento eliminado.',
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
                        text: 'Error al eliminar descuento.',
                        icon: 'erro',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
        }
    });
}

const initDataTableDescuentos = async () => {
    try {
        if (dataTableIsInitialized) {
            dataTable.destroy(); // Destroy existing DataTable instance
        }
        const response = await fetch(API_URL_BASE + `/Descuento/GetAllDescuentos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(JSON.stringify(data));

        const columns = [
            { data: 'codigo' },
            { data: 'porcentaje' },
            {
                data: 'estado',
                render: function (data, type, row) {
                    return data
                        ? '<i class="fa-solid fa-check" style="color: green;"></i>'
                        : '<i class="fa-solid fa-xmark" style="color: red;"></i>';
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                    <div id="groupBtn">
                        <button class="btn btn-orange" onclick="updateDescuento(${row.id})" id="UpdateBtn">
                                Actualizar
                        </button>
                        <button class="btn btn-orange" onclick="deleteDescuento(${row.id})" id="deleteBtn">
                                Eliminar
                        </button>
                    <div/>

                    `;
                }
            }
        ];

        dataTable = $("#datatable_descuentos").DataTable({
            data: data,
            columns: columns,
            ...dataTableOptions
        });

        dataTableIsInitialized = true;

    } catch (ex) {
        console.error('Error initializing DataTable:', ex);
        Swal.fire({
            title: 'Error',
            text: 'Error al inicializar la tabla de rutinas',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
};

$(document).ready(function () {
    $('#formDescuento').submit(async function (event) {
        event.preventDefault(); // Prevent the default form submission
        var isValid = true;
        var codigo = $("#codigo").val().trim();
        var porcentaje = $("#porcentaje").val().trim();
        var estado = false;

        var descuento = {}
        descuento.codigo = codigo;
        descuento.porcentaje = porcentaje;
        descuento.estado = estado;

        if (codigo === '') {
            $("#codigo").addClass('is-invalid');
            isValid = false;
        } else {
            $("#codigo").addClass('is-valid');
        }

        if (porcentaje === '') {
            $("#porcentaje").addClass('is-invalid');
            isValid = false;
        } else {
            $("#porcentaje").addClass('is-valid');
        }

        if (isValid) {

            $.ajax({
                url: `${API_URL_BASE}/Descuento/CreateDescuento`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(descuento),
                success: function (response, textStatus, xhr) {
                    if (xhr.responseJSON.statusCode === '400') {
                        Swal.fire({
                            title: 'Error',
                            text: 'Descuento existente',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        });
                    } else {
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Descuento Creado',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        }).then(() => {
                            location.reload();
                        });
                    }
                },
                error: function (error, textStatus, xhr) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear descuento',
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