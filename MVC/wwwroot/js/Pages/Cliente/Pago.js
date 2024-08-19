let dataTable;
let dataTableIsInitialized = false;

function getFormattedDateForSQL() {
    let today = new Date();
    let isoString = today.toISOString();
    return isoString;
}

const dataTableOptions = {
    responsive: true,
    columnDefs: [
        { className: "centered", targets: "_all" },
        { orderable: false, targets: [2] },
        { searchable: false, targets: [1] }
    ],
    pageLength: 5,
    destroy: true,
    language: {
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

const fetchData = async (cedula) => {
    try {
        const response = await fetch(`${API_URL_BASE}/Sinpe/GetHistorialDePagos?cedula=${cedula}`);
        const data = await response.json();
        return data;
    } catch (ex) {
        Swal.fire({
            title: 'Error',
            text: 'Error al obtener datos de pago.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
        return [];
    }
};

const initDataTable = async (cedula) => {
    try {
        if (dataTableIsInitialized) {
            dataTable.destroy();
        }
        const data = await fetchData(cedula);
        dataTable = $('#datatable_pagos').DataTable({
            ...dataTableOptions,
            data: data,
            columns: [
                {
                    data: 'comprobante',
                    render: function (data) {
                        return `<img src="${data}" alt="Image" style="max-width: 100px; height: auto; cursor: pointer;" onclick="showImage('${data}')">`;
                    }
                },
                {
                    data: 'fechaPago',
                    render: function (data) {
                        if (data) {
                            const date = new Date(data);
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        }
                        return '';
                    }
                },
                {
                    data: 'estadoPago',
                    render: function (data) {
                        return data === true || data === 'true'
                            ? `<i class="fa-solid fa-check" style="color: #63E6BE;"></i>`
                            : `<i class="fa-solid fa-times" style="color: #FF6347;"></i>`;
                    }
                }
            ],
             order: [[1, 'desc']]
        });
        dataTableIsInitialized = true;
    } catch (ex) {
        Swal.fire({
            title: 'Error',
            text: 'Error al inicializar la tabla de pagos.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
};

const handleFileUpload = async () => {
    const cedula = getCedulaFromSessionStorage();
    if (!cedula) {
        Swal.fire({
            title: 'Error',
            text: 'Cédula no encontrada.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
        return;
    }
    const data = await fetchData(cedula);
    const pendingComprobante = data.some(row => row.estadoPago === false);

    if (pendingComprobante) {
        Swal.fire({
            title: 'Comprobante Pendiente',
            text: 'No puede subir un nuevo comprobante hasta que el pendiente sea procesado.',
            icon: 'info',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
        return;
    }
    const { value: formValues } = await Swal.fire({
        title: 'Agregar un comprobante de pago',
        html: `
            <input type="file" id="comprobante" accept="image/*" class="swal2-input custom-swal2-input" />
        <select id="membershipType" class="swal2-input custom-swal2-select">
            <option value="" disabled selected>Seleccionar tipo de membresía</option>
            <option value="1">Membresía 1: Basica(12500)</option>
            <option value="2">Membresía 2: Plus(25000)</option>
            <option value="3">Membresía 3: Premium(32000)</option>
        </select>
        <select id="metodoPago" class="swal2-input custom-swal2-select">
            <option value="" disabled selected>Seleccionar tipo de pago</option>
            <option value="Transferencia">Transferencia bancaria</option>
            <option value="Sinpe">Sinpe</option>
            <option value="Paypal">Paypal</option>
        </select>
    `, confirmButtonText: 'Confirmar',
        confirmButtonColor: '#ff8000',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        customClass: {
            container: 'custom-swal2-container',
            input: 'custom-swal2-input',
            select: 'custom-swal2-select'
        },
        preConfirm: () => {
            const fileInput = document.getElementById('comprobante');
            const idMembresia = document.getElementById('membershipType');
            const metodoPago = document.getElementById('metodoPago');
            if (!fileInput.files[0]) {
                Swal.showValidationMessage('Seleccione un archivo');
                return false;
            }
            if (!idMembresia.value) {
                Swal.showValidationMessage('Seleccione un tipo de membresía');
                return false;
            }
            if (!metodoPago.value) {
                Swal.showValidationMessage('Seleccione un método de pago');
                return false;
            }
            return {
                file: fileInput.files[0],
                membershipType: idMembresia.value,
                metodoPago: metodoPago.value
            };
        }
    });

    if (formValues) {
        const { file, membershipType, metodoPago } = formValues;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('membresía', membershipType);
        const id = 0;
        const fechaPago = getFormattedDateForSQL();
        const comprobante = await uploadToCloudinary(file);
        const estado = false;
        const cedula = getCedulaFromSessionStorage();
        console.log("metodo Pago:" + metodoPago);

        const pago = {
            id,
            fechaPago,
            metodoPago,
            comprobante,
            estado,
            cedulaUsuario: cedula,
            idMembresia: membershipType
        };
        console.log("Pago: " + JSON.stringify(pago));
        try {
            const response = await fetch(`${API_URL_BASE}/Pago/CreatePago`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pago)
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Comprobante subido con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            } else {
                throw new Error('Error al subir el comprobante');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#d33'
            });
        }
    }
};

document.getElementById('uploadComprobanteBtn').addEventListener('click', handleFileUpload);

const getCedulaFromSessionStorage = () => {
    return sessionStorage.getItem('cedula');
};

function showImage(url) {
    Swal.fire({
        title: 'Image',
        imageUrl: url,
        imageAlt: 'Large view of image',
        showCloseButton: true,
        showConfirmButton: false,
        width: '80%',
        heightAuto: true
    });
}

window.addEventListener("load", async () => {
    const cedula = getCedulaFromSessionStorage();
    if (cedula) {
        await initDataTable(cedula);
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Cédula no encontrada en el almacenamiento local.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
});
