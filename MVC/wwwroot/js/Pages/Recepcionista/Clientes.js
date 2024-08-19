let dataTable;
let dataTableIsInitialized = false; 
var API_URL_BASE = "https://localhost:7053/api";

const dataTableOptions = {
    // Example options
    columnDefs: [
        { className: "centered", targets: "_all"}, // aca centra las columnas
        { orderable: false, targets: [5] }, // aca establece la columna numero X no va a poder ser usada para ordenar los datos
        { searchable: false, targets: [1] } // aca establece la columna numero X no va a poder ser usada para filtrar los datos
    ],
    pageLength: 5, // Aca controla la cantidad de datos que se cargan por pagina
    destroy: true, 
    language: { // escogencia del idioma
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
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

const initDataTable = async () => {
    try {
        if (dataTableIsInitialized) {
            dataTable.destroy(); // Destroy existing DataTable instance
        }

        const response = await fetch(`${API_URL_BASE}/MensualidadCliente/GetMensualidadCliente`);
        const data = await response.json();

        const columns = [
            { data: 'cedula' },
            { data: 'nombre' },
            { data: 'email' }, {
                data: 'mensualidad',
                render: function (data) {
                    // Format the total to "₡00,000.00"
                    return `₡${parseFloat(data).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;
                }
            },
            {
                data: 'estado',
                render: function (data) {
                    return data === true || data === 'true'
                        ? `<i class="fa-solid fa-check" style="color: #63E6BE;"></i>`
                        : `<i class="fa-solid fa-times" style="color: #FF6347;"></i>`;
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary imagenBtn"><i class="fa-solid fa-user"></i></button>
                        <button class="btn btn-sm btn-danger sinpeBtn" data-estado="${row.estado}" data-cedula="${row.cedula}"><i class="fa-solid fa-receipt"></i></button>
                    `;
                }
            }
        ];

        dataTable = $("#datatable_users").DataTable({
            data: data,
            columns: columns,
            ...dataTableOptions
        });

        $('#datatable_users').on('click', '.sinpeBtn', function () {
            const cedula = $(this).data('cedula');
            const estado = $(this).data('estado');

            if (estado === false || estado === 'false') {
                $.ajax({
                    url: `${API_URL_BASE}/Sinpe/GetSinpeValue?cedula=${cedula}`,
                    method: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        // Check if the response has default values
                        if (
                            !data.nombre ||
                            !data.cedula ||
                            !data.comprobante ||
                            data.fechaPago === '0001-01-01T00:00:00' ||
                            data.total === 0
                        ) {
                            Swal.fire({
                                title: "Atención",
                                text: "Este usuario no tiene comprobantes pendientes reportados. El cliente debe realizar un pago y subir un comprobante para activar su cuenta",
                                icon: 'info',
                                confirmButtonText: 'Ok',
                                confirmButtonColor: '#ff8000'
                            });
                        } else {
                            Swal.fire({
                                title: "Comprobante SINPE",
                                html: `
                            <p>Fecha de Pago: ${data.fechaPago}</p>
                            <p>Estado de la cuenta: ${data.estadoUsuario === true ? 'Activada' : 'Desactivada'}</p>
                            <p>Estado Pago: ${data.estadoPago === true ? 'Aprobado' : 'Denegado'}</p>
                            <p>Total: ${data.total}</p>
                            <p>Compruebe que el total sea correcto y seleccione 'Activar' para activar la cuenta del cliente</p>
                        `,
                                imageUrl: data.comprobante,
                                imageWidth: 400,
                                imageHeight: 200,
                                imageAlt: "Custom image",
                                showCancelButton: true,
                                confirmButtonText: "Activar",
                                cancelButtonText: "Cancelar",
                                confirmButtonColor: "#ff8000",
                                cancelButtonColor: "#d33",
                                showLoaderOnConfirm: true,
                                preConfirm: async () => {
                                    try {
                                        const response = await fetch(`${API_URL_BASE}/Cliente/UpdateClienteEstado/${cedula}`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });

                                        if (!response.ok) {
                                            throw new Error('Error al actualizar el estado del cliente');
                                        }

                                        return true;
                                    } catch (error) {
                                        Swal.showValidationMessage(`Fallo en la petición: ${error.message}`);
                                        return false;
                                    }
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    initDataTable(); // Refresh the data table
                                    Swal.fire({
                                        title: 'Cliente Aprobado',
                                        text: 'El usuario ya fue activado en el sistema.',
                                        icon: 'success',
                                        confirmButtonText: 'Ok',
                                        confirmButtonColor: '#ff8000'
                                    });
                                }
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            title: 'Error',
                            text: "No se pudo obtener la información del SINPE.",
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        });
                    }
                });
            } else {
                Swal.fire({
                    title: 'Cuenta ya está activa.',
                    text: "La cuenta ya fue activada, si desea desactivar una cuenta ingrese a 'Manejo de Cuentas'",
                    icon: 'info',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            }
        });

        $('#datatable_users').on('click', '.imagenBtn', function () {
            Swal.fire({
                title: '¿Agregar un comprobante de pago?',
                text: 'Será redireccionado para subir un nuevo comprobante de pago.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#ff8000',
                cancelButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Perform the redirection
                    window.location.href = 'https://localhost:7021/Recepcionista/Pagos';
                }
            });

        });

        dataTableIsInitialized = true;

    } catch (ex) {
        Swal.fire({
            title: 'Error',
            text: 'Error al iniciar la tabla de usuarios',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
};

window.addEventListener("load", async () => {
    await initDataTable();
});