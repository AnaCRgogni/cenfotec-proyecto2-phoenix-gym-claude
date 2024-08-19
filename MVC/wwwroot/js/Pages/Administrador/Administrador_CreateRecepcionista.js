$(document).ready(async function () {

    $('#showPassword').on('change', function () {
        var passwordInput = $('#contrasena');
        var isChecked = $(this).is(':checked');
        if (isChecked) {
            passwordInput.attr('type', 'text');
        } else {
            passwordInput.attr('type', 'password');
        }
    });

    // Recorro cada uno de los forms
    $('#formRecepcionista').submit(async function (event) {
        event.preventDefault(); // Evitar el envío automático del formulario

        var isValid = true; // Declaro que la validación empieza en true
        // Limpio errores
        $(".form-control").removeClass("is-invalid");

        var cedula = $("#cedula").val().trim();
        var nombre = $("#nombre").val().trim();
        var apellido1 = $("#apellido1").val().trim();
        var apellido2 = $("#apellido2").val().trim();
        var email = $("#email").val().trim();
        var contrasena = $("#contrasena").val().trim();
        var telefono = $("#telefono").val().trim();
        var fechaNacimiento = $("#fechaNacimiento").val().trim();
        var generoCliente = $("#generoCliente").val();

        // Validación de campos obligatorios
        if (nombre === '') {
            $('#nombre').addClass('is-invalid');
            isValid = false;
        } else {
            $('#nombre').addClass('is-valid');
        }

        if (apellido1 === '') {
            $('#apellido1').addClass('is-invalid');
            isValid = false;
        } else {
            $('#apellido1').addClass('is-valid');
        }

        if (apellido2 === '') {
            $('#apellido2').addClass('is-invalid');
            isValid = false;
        } else {
            $('#apellido2').addClass('is-valid');
        }

        if (telefono === '') {
            $('#telefono').addClass('is-invalid');
            isValid = false;
        } else {
            $('#telefono').addClass('is-valid');
        }

        // Validación de formato de correo electrónico
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

        // Validación de fecha de nacimiento
        if (fechaNacimiento === '') {
            $('#fechaNacimiento').addClass('is-invalid');
            isValid = false;
        } else {
            $('#fechaNacimiento').addClass('is-valid');
        }

        // Validación de formato de contraseña
        if (contrasena === '') {
            $('#contrasena').addClass('is-invalid');
            isValid = false;
        } else {
            var passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~¡¿])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~¡¿]{8,}$/;
            if (!passwordPattern.test(contrasena)) {
                $('#contrasena').addClass('is-invalid');
                isValid = false;
            } else {
                $('#contrasena').addClass('is-valid');
            }
        }

        if (generoCliente === null) {
            $('#generoCliente').addClass('is-invalid');
            isValid = false;
        } else {
            $('#generoCliente').addClass('is-valid');
        }

        if (cedula === '') {
            $('#cedula').addClass('is-invalid');
            isValid = false;
        } else {
            $('#cedula').addClass('is-valid');
        }

        if (isValid) {
            Swal.fire({
                title: 'Enviando información...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading(); // Muestra el spinner
                }
            });

            try {
                //post de axios de password
                const hasResult = await handlePassword(contrasena);
                const salt = hasResult.salt;
                const hashedContra = hasResult.hashedPassword;

                const cliente = {
                    cedula: cedula,
                    rolUsuario: 'Recepcionista',
                    nombre: nombre,
                    apellido1: apellido1,
                    apellido2: apellido2,
                    email: email,
                    contrasena: hashedContra,
                    telefono: telefono,
                    fechaNacimiento: fechaNacimiento,
                    generoCliente: generoCliente,
                    estado: true
                };

                const clientResponse = await $.ajax({
                    url: `${API_URL_BASE}/Recepcionista/CreateRecepcionista`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(cliente),
                });

                if (clientResponse === 'success') {
                    await $.ajax({
                        url: `${API_URL_BASE}/Password/SaveSalt`,
                        method: 'POST',
                        data: JSON.stringify({
                            saltValue: salt,
                            Cedula: cedula,
                        }),
                        contentType: "application/json;charset=utf-8"
                    });

                    Swal.fire({
                        title: 'Cuenta Creada',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    }).then(() => {
                        window.location.href = 'https://localhost:7021/Administrador/Usuarios'; // Redirect to the success page
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al procesar la solicitud.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000'
                });
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Revise las casillas marcadas en rojo.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }
    }); // End of formRecepcionista submit
});
