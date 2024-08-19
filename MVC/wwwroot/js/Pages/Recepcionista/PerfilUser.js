$(document).ready(async function () {
    var API_URL_BASE = "https://localhost:7053/api";
    var miUrl = window.location.href;
    var cedula = miUrl.split('/').pop();

    try {
        const response = await fetch(API_URL_BASE + "/User/GetUsersValue?cedula=" + cedula);
        const data = await response.json();
        $('#nombre').val(data.nombre);
        $('#cedula').val(data.cedula);
        $('#apellido1').val(data.apellido1);
        $('#apellido2').val(data.apellido2);
        $('#telefono').val(data.telefono);
        $('#email').val(data.email);
        $('#rolUsuario').val(data.rolUsuario);
        $('#tipoEntrenador').val(data.tipoEntrenador);
        $('#tarifaHoraEntrenadorPersonal').val(data.tarifaHoraEntrenadorPersonal);
        $('#estado').val(data.estado);
        $('#idMembresia').val(data.idMembresia);

        handleRoleBasedCharging(data.rolUsuario);
    } catch (error) {
        console.error('Error fetching user data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error actualizando usuario. Por favor, intente nuevamente más tarde.',
            confirmButtonColor: '#ff8000'
        });
    }

    $('#formUser').submit(async function (event) {
        event.preventDefault(); // Prevent default form submission

        var isValid = true;
        $(".form-control").removeClass("is-invalid is-valid");

        // Retrieve field values
        var nombre = $('#nombre').val();
        var cedula = $('#cedula').val();
        var apellido1 = $('#apellido1').val();
        var apellido2 = $('#apellido2').val();
        var telefono = $('#telefono').val();
        var email = $('#email').val();

        // Validate cedula
        if (cedula === '') {
            $('#cedula').addClass('is-invalid');
            isValid = false;
        } else {
            $('#cedula').addClass('is-valid');
        }

        // Validate nombre
        if (nombre === '') {
            $('#nombre').addClass('is-invalid');
            isValid = false;
        } else {
            $('#nombre').addClass('is-valid');
        }

        // Validate apellido1
        if (apellido1 === '') {
            $('#apellido1').addClass('is-invalid');
            isValid = false;
        } else {
            $('#apellido1').addClass('is-valid');
        }

        // Validate apellido2
        if (apellido2 === '') {
            $('#apellido2').addClass('is-invalid');
            isValid = false;
        } else {
            $('#apellido2').addClass('is-valid');
        }

        // Validate telefono
        if (telefono === '') {
            $('#telefono').addClass('is-invalid');
            isValid = false;
        } else {
            $('#telefono').addClass('is-valid');
        }

        // Validate email
        if (email === '') {
            $('#email').addClass('is-invalid');
            isValid = false;
        } else {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                $('#email').addClass('is-invalid');
                isValid = false;
            } else {
                $('#email').addClass('is-valid');
            }
        }

        // Continue with form submission if valid
        if (isValid) {
            var formData = {
                nombre: nombre,
                cedula: cedula,
                apellido1: apellido1,
                apellido2: apellido2,
                telefono: telefono,
                email: email,
                rolUsuario: $('#rolUsuario').val(),
                tipoEntrenador: $('#tipoEntrenador').val(),
                tarifaHoraEntrenadorPersonal: parseFloat($('#tarifaHoraEntrenadorPersonal').val()),
                estado: ($('#estado').val() === "true"),
                idMembresia: parseFloat($('#idMembresia').val())
            };

            try {
                const response = await fetch(`${API_URL_BASE}/User/UpdateUser/${cedula}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('No se pudo actualizar el usuario.');
                }

                console.log('Usuario actualizado');
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Usuario actualizado correctamente.',
                    confirmButtonColor: '#ff8000'
                }).then(() => {
                    window.location.href = '/Recepcionista/ManejoDeCuentas'; // Replace with your target URL
                });
            } catch (error) {
                console.error('Error updating user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error actualizando usuario. Por favor, intente nuevamente más tarde.',
                    confirmButtonColor: '#ff8000'
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, complete todos los campos requeridos correctamente.',
                confirmButtonColor: '#ff8000'
            });
        }
    });
    function handleRoleBasedCharging(role) {
        // Hide or show form fields and their labels based on the role
        if (role === 'Entrenador') {
            $('#tipoEntrenador').show().prop('disabled', false);
            $('#tarifaHoraEntrenadorPersonal').show().prop('disabled', false);
            $('#idMembresia').hide().val('');

            // Show labels for these fields
            $('label[for="tipoEntrenador"]').show();
            $('label[for="tarifaHoraEntrenadorPersonal"]').show();
            $('label[for="idMembresia"]').hide();
        } else {
            $('#tipoEntrenador').hide().val('');
            $('#tarifaHoraEntrenadorPersonal').hide().val('');
            $('#idMembresia').show().prop('disabled', false);

            // Hide labels for these fields
            $('label[for="tipoEntrenador"]').hide();
            $('label[for="tarifaHoraEntrenadorPersonal"]').hide();
            $('label[for="idMembresia"]').show();
        }
    }
});