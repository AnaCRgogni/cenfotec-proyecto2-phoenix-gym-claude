let dataTablePago;
let dataTableClientes;

let dataTablePagoIsInitialized = false;
let dataTableClientesIsInitialized = false;

let memberships = [];
let discounts = [];

function getFormattedDateForSQL() {
    let today = new Date();
    let isoString = today.toISOString();
    return isoString;
}

const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: "_all" },
        { orderable: false, targets: [4] },
        { searchable: false, targets: [4] }
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

const initDataTables = async () => {
    try {
        if (dataTablePagoIsInitialized) {
            dataTablePago.destroy(); 
        }
        if (dataTableClientesIsInitialized) {
            dataTableClientes.destroy();
        }
        const membershipsResponse = await fetch(`${API_URL_BASE}/Mensualidad/GetAllMembresias`);
        memberships = await membershipsResponse.json();

        const discountResponse = await fetch(`${API_URL_BASE}/Descuento/GetAllDescuentos`);
        discounts = await discountResponse.json();
        console.log("Discounts Response:", discounts);

        const pagoResponse = await fetch(`${API_URL_BASE}/Sinpe/GetSinpes`);
        const pagoData = await pagoResponse.json();

        const clienteResponse = await fetch(`${ API_URL_BASE }/MedicionCliente/GetMedicionCliente`);
        const clienteData = await clienteResponse.json();

        dataTablePago = $('#datatable_pago').DataTable({
            ...dataTableOptions,
            data: pagoData,
            columns: [
                { data: 'nombre' },
                { data: 'cedula' },
                { data: 'comprobante', 
                    render: function (data, type, row) {

                        return `<img src="${data}" alt="Image" style="max-width: 100px; height: auto; cursor: pointer;" onclick="showImage('${data}')">
                    `;
                    }
                },
                {
                    data: 'fechaPago',
                    render: function (data) {
                        const date = new Date(data);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    }
                },
                {
                    data: 'estadoPago',
                    render: function (data) {
                        return data === true || data === 'true'
                            ? `<i class="fa-solid fa-check" style="color: #63E6BE;"></i>`
                            : `<i class="fa-solid fa-times" style="color: #FF6347;"></i>`;
                    }
                },
                {
                    data: 'total',
                    render: function (data) {
                        // Format the total to "₡00,000.00"
                        return `₡${parseFloat(data).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                        <button class="btn btn-sm btn-secondary aprobarBtn user-profile-button" data-cedula="${row.cedula}"><i class="fa-solid fa-check"></i>
                        <button class="btn btn-sm btn-danger denegarBtn" data-estado="${row.estado}" data-cedula="${row.cedula}"><i class="fa-solid fa-xmark fa-lg"></i></button>
                    `;
                    }
                }
            ]
        });

        dataTableClientes = $('#datatable_clientes').DataTable({
            ...dataTableOptions,
            data: clienteData,
            columns: [
                { data: 'nombre' },
                { data: 'cedula' },
                { data: 'email' },
                {
                    data: 'idMembresia',
                    render: function (data) {
                        const membership = memberships.find(m => m.id === data);
                        return membership ? `${membership.id} - ${membership.tipo} - ₡${membership.mensualidad}` : "Desconocido";
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                        <button class="btn btn-sm btn-info comprobanteBtn " data-cedula="${row.cedula}" data-membresia="${row.idMembresia}"><i class="fa-solid fa-receipt"></i></button>

                    `;
                    }
                }
            ]
        });

        dataTablePagoIsInitialized = true;
        dataTableClientesIsInitialized = true;

        $('#datatable_pago').on('click', '.aprobarBtn', async function () {
            const cedula = $(this).data('cedula');
            Swal.fire({
                title: '¿Aprobar este pago?',
                text: "Compruebe que el monto transferido sea igual al total.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#ff8000',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aprobar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'El pago fue aprobado.',
                        icon: 'success',
                        confirmButtonColor: '#ff8000',
                        confirmButtonText: 'Ok'
                    });
                    try {
                        const response = await fetch(`${API_URL_BASE}/Cliente/UpdateClienteEstado/${cedula}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (response.ok) {
                            console.log('Pago aprobado y estado actualizado.');
                            window.location.reload();
                        } else {
                            console.error('Error al actualizar el estado del cliente.');
                            Swal.fire('Error', 'No se pudo aprobar el pago.', 'error');
                        }
                    } catch (error) {
                        console.error('Error en la solicitud:', error);
                        Swal.fire('Error', 'Error al procesar la solicitud.', 'error');
                    }
                }
            });
        });

        $('#datatable_pago').on('click', '.denegarBtn', function () {
            const estado = $(this).data('estado');
            const cedula = $(this).data('cedula');
            Swal.fire({
                title: '¿Deshabilitar la cuenta del cliente?',
                text: `Si el monto no es el mismo del total, la cuenta del cliente sera deshabilitada.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff8000',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Deshabilitar cuenta',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Denegado',
                        'La cuenta ha sido bloqueada.',
                        'success'
                    );
                }
                try
                {
                    const response = await fetch(`${API_URL_BASE}/Cliente/UpdateClienteEstadoDeshabilitar/${cedula}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        console.log('Pago aprobado y estado actualizado.');
                        window.location.reload();
                    } else {
                        console.error('Error al actualizar el estado del cliente.');
                        Swal.fire('Error', 'No se pudo aprobar el pago.', 'error');
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Swal.fire('Error', 'Error al procesar la solicitud.', 'error');
                }
            });
        });
        $('#datatable_clientes').on('click', '.comprobanteBtn', async function () {
            const cedula = String($(this).data('cedula'));
            const membresiaId = String($(this).data('membresia'));     
            const membership = memberships.find(m => m.id.toString() === membresiaId);
            if (!membership) {
                Swal.fire({
                    title: 'Error',
                    text: 'Membresía no encontrada.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#ff8000'
                });
                return;
            }
            const { value: formValues } = await Swal.fire({
                title: 'Agregar un comprobante de pago',
                html: `
                    <input type="file" id="comprobante" accept="image/*" class="swal2-input custom-swal2-input" />
                    <select id="metodoPago" class="swal2-input custom-swal2-select">
                        <option value="" disabled selected>Seleccionar tipo de pago</option>
                        <option value="Transferencia">Transferencia bancaria</option>
                        <option value="Sinpe">Sinpe</option>
                        <option value="Paypal">Paypal</option>
                    </select>
                    <input type="text" id="descuento" class="swal2-input custom-swal2-input" placeholder="Ingrese el descuento (opcional)" />
                `,
                confirmButtonText: 'Confirmar',
                confirmButtonColor: '#ff8000',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                showCancelButton: true,
                preConfirm: () => {
                    const fileInput = document.getElementById('comprobante');
                    const metodoPago = document.getElementById('metodoPago');
                    const descuentoInput = document.getElementById('descuento').value;
                    let descuentoPorcentaje = 0;

                    if (!fileInput.files[0]) {
                        Swal.showValidationMessage('Seleccione un archivo');
                        return false;
                    }
                    if (!metodoPago.value) {
                        Swal.showValidationMessage('Seleccione un metodo de pago');
                        return false;
                    }
                    if (descuentoInput) {
                        const isValidDiscount = discounts.find(d => d.codigo === descuentoInput && d.estado === true);
                        if (!isValidDiscount) {
                            Swal.showValidationMessage('El código de descuento no es válido o ha expirado.');
                            return false;
                        }
                        descuentoPorcentaje = isValidDiscount.porcentaje;
                    }
                    const totalConDescuento = membership.mensualidad - (membership.mensualidad * (descuentoPorcentaje / 100));
                    return {
                        file: fileInput.files[0],
                        metodoPago: metodoPago.value,
                        descuentoPorcentaje,
                        total: totalConDescuento
                    };
                }
            });

            if (formValues) {
                const formData = new FormData();
                formData.append('file', formValues.file);
                formData.append('cedula', cedula);
                formData.append('membresia', membresiaId);

                const id = 0;
                const fechaPago = getFormattedDateForSQL();
                const comprobante = await uploadToCloudinary(formValues.file); // Use the file name or process file as needed
                const estado = false;

                const pago = {
                    id,
                    fechaPago,
                    metodoPago: formValues.metodoPago,
                    comprobante,
                    estado,
                    cedulaUsuario: cedula,
                    total: formValues.total,
                    idMembresia: membresiaId

                };

                console.log("Pago: " + JSON.stringify(pago));
                try {
                    const pagoResponse = await fetch(`${API_URL_BASE}/Pago/CreatePago`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(pago)
                    });

                    if (pagoResponse.ok) {
                        Swal.fire({
                            title: 'Éxito',
                            text: 'El comprobante se ha subido correctamente.',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#ff8000'
                        });
                        window.location.reload();
                    } else {
                        // Handle error response
                        console.error('Error al crear el pago.');
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo crear el comprobante.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#ff8000'
                        });
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al procesar la solicitud.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#d33'
                    });
                }
            }
        });
    } catch (ex) {
        Swal.fire({
            title: 'Error',
            text: 'Error al iniciar la tabla de usuarios.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
};
function showImage(url) {
    Swal.fire({
        title: 'Imagen',
        imageUrl: url,
        imageAlt: 'Vista agrandada de la imagen.',
        showCloseButton: true,
        showConfirmButton: false,
        width: '80%',
        heightAuto: true
    });
}

window.addEventListener("load", async () => {
    await initDataTables();
});
