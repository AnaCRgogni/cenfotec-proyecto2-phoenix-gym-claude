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
    columnDefs: [
        { className: "centered", targets: "_all" }
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

const initDataTable = async () => {
    try {
        if (dataTableIsInitialized && dataTable) {
            dataTable.destroy();
        }

        const trainersResponse = await $.ajax({
            url: `${API_URL_BASE}/Entrenador/GetEntrenadores?rolUsuario=Entrenador`,
            type: 'GET',
            dataType: 'json'
        });

        const trainerMap = {};
        trainersResponse.forEach(trainer => {
            const fullName = `${trainer.nombre} ${trainer.apellido1} ${trainer.apellido2}`;
            trainerMap[trainer.id] = fullName;
        });

        const classesResponse = await $.ajax({
            url: `${API_URL_BASE}/Clase/GetAllClases`,
            method: 'GET',
            dataType: 'json'
        });

        const integratedData = classesResponse.map(classItem => {
            return {
                ...classItem,
                nombreEntrenador: trainerMap[classItem.entrenador] || 'Desconocido' 
            };
        });

        if (integratedData.length === 0) {
            Swal.fire({
                title: 'Sin Clases',
                text: 'No se encontraron clases asociadas a este usuario.',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }

        const columns = [
            { 
                data: 'fechaClase',
                render: function(data, type, row) {
                    return formatDateString(data);
                }
            },
            { data: 'nombreClase' },
            { data: 'cupos' },
            { data: 'nombreEntrenador' } 
        ];

        dataTable = $("#datatable_users").DataTable({
            data: integratedData,
            columns: columns,
            ...dataTableOptions
        });

        dataTableIsInitialized = true;

    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Error al cargar las clases.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
        console.error('Error loading classes:', error);
    }
};

window.addEventListener("load", async () => {
    await initDataTable();
});
