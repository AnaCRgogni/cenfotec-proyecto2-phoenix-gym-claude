$(document).ready(function() {
    const container = document.querySelector('.card-container');
    const accordionContainer = document.querySelector('.accordion-container');
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    
    let currentIndex = 0;

    function formatDateString(dateTimeString) {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    function populateCards(clases) {
        clases.forEach(clase => {
            const fechaClase = new Date(clase.fechaClase);
            if (fechaClase > new Date()) {
                const card = document.createElement('div');
                card.classList.add('card', 'choice', 'bg-card-primary', 'text-white');
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${clase.nombreClase}</h5>
                        <p class="card-text">${formatDateString(fechaClase)}</p>
                        <button type="button" class="btn btn-outline-light botonReserva" data-fecha-clase="${clase.fechaClase}" data-id-clase="${clase.id}">Reservar Clase</button>
                    </div>
                `;
                container.appendChild(card);
            }
        });
        adjustContainerWidth();
        updateCardPosition();
    }

    function updateCardPosition() {
        const choice = document.querySelector('.choice');
        if (choice && container) {
            const cardWidth = choice.offsetWidth + 20; // width + margin
            const maxIndex = Math.max(0, Math.floor((container.scrollWidth - accordionContainer.offsetWidth) / cardWidth));
            container.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            container.style.transition = 'transform 0.3s ease-out';
        }
    }

    function adjustContainerWidth() {
        const choice = document.querySelector('.choice');
        if (choice && container) {
            const cardWidth = choice.offsetWidth + 20; // width + margin
            const cardCount = document.querySelectorAll('.choice').length;
            container.style.width = `${cardWidth * cardCount}px`;
        }
    }
    
    $(window).on('resize', adjustContainerWidth);
    adjustContainerWidth(); 

    $.ajax({
        url: `${API_URL_BASE}/Clase/GetAllClases`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            populateCards(data);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });

    $(document).on('click', '.botonReserva', function() {
        var cedula = sessionStorage.getItem('cedula');
        var email = sessionStorage.getItem('correo');
        var fechaClase = new Date($(this).data('fecha-clase')).toISOString(); 
        var idClase = $(this).data('id-clase');
    
        const data = { Cedula: cedula, FechaClase: fechaClase, IdClase: idClase, Email : email};
    
        var url = `${API_URL_BASE}/Clase/ReservarClase?cedula=${encodeURIComponent(cedula)}&fechaClase=${encodeURIComponent(fechaClase)}&idClase=${idClase}&email=${encodeURIComponent(email)}`;
        
        $.ajax({
            url: url,
            type: 'POST',
            data: $.param(data),
            success: function(response) {
                if (response.success) {
                    Swal.fire({
                        title: 'Éxito',
                        text: response.message,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                    initDataTable();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.message,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            },
        });
    });
    }
);

let dataTable;
let dataTableIsInitialized = false; 

function formatDateString(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const dataTableOptions = {
    // Example options
    columnDefs: [
        { className: "centered", targets: "_all"}, // aca centra las columnas
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
            dataTable.destroy(); 
        }

        const cedula = sessionStorage.getItem('cedula');
        const email = sessionStorage.getItem('correo');

        const userResponse = await $.ajax({
            url: `${API_URL_BASE}/Cliente/GetClientebyEmail?email=${encodeURIComponent(email)}`,
            method: 'GET',
            dataType: 'json'
        });

        const userid = userResponse.id;

        console.log(userid);

        const classesResponse = await $.ajax({
            url: `${API_URL_BASE}/Clase/GetClasesXCliente?cedula=${encodeURIComponent(cedula)}`,
            method: 'GET',
            dataType: 'json'
        });

        console.log(classesResponse)

        const columns = [
        { 
            data: 'fechaClase',
            render: function(data, type, row) {
                return formatDateString(data);
            }
        },
            { data: 'nombreClase' },
            { data: 'cupos' },
        ];

        dataTable = $("#datatable_users").DataTable({
            data: classesResponse,
            columns: columns,
            ...dataTableOptions
        });

        dataTableIsInitialized = true;

    } catch (ex) {
        Swal.fire({
            title: 'Error',
            text: 'No se encontraron clases asociadas a este usuario',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }
};

window.addEventListener("load", async () => {
    await initDataTable();
});

