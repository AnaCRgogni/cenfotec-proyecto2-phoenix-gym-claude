let dataTable;
let dataTableIsInitialized = false;
var API_URL_BASE = "https://localhost:7053/api";

$(document).ready(function () {
    $('#showPassword').on('change', function () {
        var passwordInput = $('#contrasena');
        var isChecked = $(this).is(':checked');
        if (isChecked) {
            passwordInput.attr('type', 'text');
        } else {
            passwordInput.attr('type', 'password');
        }
    });

    $('#tipoEntrenador').on('change', function () {
        var tarifaHoraGroup = $('#tarifaHoraGroup');
        var selectedValue = $(this).val();

        if (selectedValue === 'Entrenador Personal' || selectedValue === 'Ambos') {
            tarifaHoraGroup.show();
            $('#tarifaHoraEntrenadorPersonal').prop('required', true);
        } else {
            tarifaHoraGroup.hide();
            $('#tarifaHoraEntrenadorPersonal').prop('required', false).val('').removeClass('is-invalid is-valid');
        }
    });

    $('#cedula, #telefono').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#formEntrenador').submit(async function (event)
    {
        event.preventDefault();

        var isValid = true;
        $(".form-control").removeClass("is-invalid is-valid");

        var cedula = $("#cedula").val().trim();
        var nombre = $("#nombre").val().trim();
        var apellido1 = $("#apellido1").val().trim();
        var apellido2 = $("#apellido2").val().trim();
        var telefono = $("#telefono").val().trim();
        var email = $("#email").val().trim();
        var fechaNacimiento = $("#fechaNacimiento").val().trim();
        var contrasena = $("#contrasena").val().trim();
        var tipoEntrenador = $("#tipoEntrenador").val();
        var tarifaHoraEntrenadorPersonal = $("#tarifaHoraEntrenadorPersonal").val();

        if (cedula === '') {
            $('#cedula').addClass('is-invalid');
            isValid = false;
        } else
        {
            $('#cedula').addClass('is-valid');
        }

        if (nombre === '')
        {
            $('#nombre').addClass('is-invalid');
            isValid = false;
        } else
        {
            $('#nombre').addClass('is-valid');
        }

        if (apellido1 === '')
        {
            $('#apellido1').addClass('is-invalid');
            isValid = false;
        } else
        {
            $('#apellido1').addClass('is-valid');
        }

        if (apellido2 === '')
        {
            $('#apellido2').addClass('is-invalid');
            isValid = false;
        } else
        {
            $('#apellido2').addClass('is-valid');
        }

        if (telefono === '')
        {
            $('#telefono').addClass('is-invalid');
            isValid = false;
        } else
        {
            $('#telefono').addClass('is-valid');
        }

        if (email === '')
        {
            $('#email').addClass('is-invalid');
            isValid = false;
        } else
        {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email))
            {
                $('#email').addClass('is-invalid');
                isValid = false;
            } else
            {
                $('#email').addClass('is-valid');
            }
        }

        if (fechaNacimiento === '')
        {
            $('#fechaNacimiento').addClass('is-invalid');
            isValid = false;
        } else
        {
            $('#fechaNacimiento').addClass('is-valid');
        }

        if (contrasena === '')
        {
            $('#contrasena').addClass('is-invalid');
            isValid = false;
        } else
        {
            var passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~¡¿])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~¡¿]{8,}$/;
            if (!passwordPattern.test(contrasena))
            {
                $('#contrasena').addClass('is-invalid');
                isValid = false;
            } else
            {
                $('#contrasena').addClass('is-valid');
            }
        }

        if (tipoEntrenador === null)
        {
            $('#tipoEntrenador').addClass('is-invalid');
            isValid = false;
        } else
        {
            $('#tipoEntrenador').addClass('is-valid');
        }

        if ($('#tarifaHoraEntrenadorPersonal').is(':visible') && (tarifaHoraEntrenadorPersonal === '' || isNaN(tarifaHoraEntrenadorPersonal)))
        {
            $('#tarifaHoraEntrenadorPersonal').addClass('is-invalid');
            isValid = false;
        } else
        {
            $('#tarifaHoraEntrenadorPersonal').addClass('is-valid');
        }

        if (isValid) {
            const hasResult = await handlePassword(contrasena);
            const salt = hasResult.salt;
            const hashedContra = hasResult.hashedPassword;

            console.log('Salt:', salt);
            console.log('Hashed Password:', hashedContra);

            var formData = {
                cedula: cedula,
                nombre: nombre,
                apellido1: apellido1,
                apellido2: apellido2,
                telefono: telefono,
                email: email,
                fechaNacimiento: fechaNacimiento + 'T00:00:00',
                contrasena: hashedContra,
                tipoEntrenador: tipoEntrenador,
                tarifaHoraEntrenadorPersonal: parseFloat(tarifaHoraEntrenadorPersonal) || null
            };

            console.log(formData);
            console.log(JSON.stringify(formData));

            $.ajax({
                url: API_URL_BASE + '/Entrenador/CreateEntrenador',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function (response) {
                    console.log(response);
                    if (response === 'success') {
                        Swal.fire({
                            title: 'Cuenta creada',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        }).then(() => {
                            $.ajax({
                                url: `${API_URL_BASE}/Password/SaveSalt`,
                                method: 'POST',
                                data: JSON.stringify({
                                    saltValue: salt,
                                    Cedula: cedula,
                                }),
                                contentType: "application/json;charset=utf-8",
                                success: function (response) {
                                    console.log('Éxito al guardar el salt:', response);
                                    Swal.fire({
                                        title: 'Éxito',
                                        text: 'La contraseña se ha guardado correctamente.',
                                        icon: 'success',
                                        confirmButtonText: 'Ok',
                                        confirmButtonColor: '#ff8000'
                                    }).then(() => {
                                        location.reload();
                                    });
                                },
                                error: function (xhr, status, error) {
                                    console.error('Error al guardar el salt:', error);
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'Ocurrió un error al guardar la contraseña.',
                                        icon: 'error',
                                        confirmButtonText: 'Ok',
                                        confirmButtonColor: '#ff8000'
                                    });
                                }
                            });
                        });
                    }
                },
                error: function (error) {
                    console.log(error.errors);
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrió un error al crear la cuenta.',
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

            const response = await fetch(API_URL_BASE + "/ViewUsers/GetMedicionCliente");
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
                text: 'Error al iniciar la tabla de usuarios.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }
    };
});
