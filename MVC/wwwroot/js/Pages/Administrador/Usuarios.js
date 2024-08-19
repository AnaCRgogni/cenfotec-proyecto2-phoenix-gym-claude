let dataTable;
let dataTableIsInitialized = false;
var API_URL_BASE = "https://localhost:7053/api";

$(document).ready(function () {
   
    window.addEventListener("load", async () =>
    {
        await initDataTable();
    });

    $(document).on('click', '.delete-btn', function ()
    {
        const cedula = $(this).data('cedula');
        console.log(cedula);

        Swal.fire({
            title: "¿Desea eliminar este usuario?",
            text: "No se puede recuperar la información de este usuario una vez se elimine.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff8000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar usuario"
        }).then(async (result) =>
        {
            if (result.isConfirmed)
            {
                try {
                    const response = await fetch(`${API_URL_BASE}/Cliente/DeleteCliente/${cedula}`,
                    {
                        method: 'DELETE',
                        headers:
                        {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok)
                    {
                        await initDataTable();
                        Swal.fire({
                            title: 'Usuario Eliminado',
                            text: 'El usuario ha sido eliminado exitosamente.',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        });
                    } else
                    {
                        throw new Error('Error deleting user');
                    }
                } catch (error)
                {
                    console.error('Error deleting user:', error);
                    Swal.fire(
                    {
                        title: 'Error',
                        text: 'Error al eliminar el usuario.',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            }
        });
    });

    $(document).on('click', '.edit-btn', function () {
        const cedula = $(this).data('cedula');
        console.log(cedula);
    });

    const dataTableOptions = {
        columnDefs: [
            { className: "centered", targets: "_all" }, // centers columns
            { orderable: false, targets: [4] }, // makes column X non-orderable
            { searchable: false, targets: [4] } // makes column X non-searchable
        ],
        pageLength: 5, // controls number of records per page
        destroy: true,
        language: {
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "Ningún usuario encontrado",
            info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Ningún usuario encontrado",
            infoFiltered: "(filtrados desde _MAX_ registros totales)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
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

            const response = await fetch(API_URL_BASE + "/ViewUsers/GetMedicionUsers");
            const data = await response.json();

            const columns = [
                { data: 'nombre' },
                { data: 'cedula' },
                { data: 'email' },
                { data: 'rolUsuario' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                        <button class="btn btn-sm btn-danger delete-btn" data-cedula="${row.cedula}"><i class="fa-solid fa-xmark fa-lg"></i></button>
                        <a href="./PerfilUser/${row.cedula}" class="btn btn-sm btn-secondary edit-btn user-profile-button" data-cedula="${row.cedula}">
                            <i class="fa-solid fa-user user-profile-button"></i> Perfil Usuario
                        </a>
                    `;
                    }
                }
            ];

            dataTable = $("#datatable_users").DataTable({
                data: data,
                columns: columns,
                ...dataTableOptions
            });

            dataTableIsInitialized = true;

        } catch (ex) {
            console.error('Error initializing DataTable:', ex);
            Swal.fire({
                title: 'Error',
                text: 'Error al inicializar la tabla de usuarios.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }
    };
});
