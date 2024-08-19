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

    $('#formEntrenador').submit(async function (event) {
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

        // Validaciones
        if (cedula === '') {
            $('#cedula').addClass('is-invalid');
            isValid = false;
        } else {
            $('#cedula').addClass('is-valid');
        }

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

        if (fechaNacimiento === '') {
            $('#fechaNacimiento').addClass('is-invalid');
            isValid = false;
        } else {
            $('#fechaNacimiento').addClass('is-valid');
        }

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

        if (tipoEntrenador === null || tipoEntrenador === '') {
            $('#tipoEntrenador').addClass('is-invalid');
            isValid = false;
        } else {
            $('#tipoEntrenador').addClass('is-valid');
        }

        if ($('#tarifaHoraEntrenadorPersonal').is(':visible') && (tarifaHoraEntrenadorPersonal === '' || isNaN(tarifaHoraEntrenadorPersonal))) {
            $('#tarifaHoraEntrenadorPersonal').addClass('is-invalid');
            isValid = false;
        } else {
            $('#tarifaHoraEntrenadorPersonal').addClass('is-valid');
        }

        if (isValid) {
            const hasResult = await handlePassword(contrasena);
            const salt = hasResult.salt;
            const hashedContra = hasResult.hashedPassword;

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

            $.ajax({
                url: API_URL_BASE + '/Entrenador/CreateEntrenador',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function (response) {
                    console.log(response);
                    if (response === 'success') {
                        Swal.fire({
                            title: 'Cuenta Creada',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
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
                                    location.reload();
                                },
                                error: function (xhr, status, error) {
                                    console.error('Error al guardar el salt:', error);
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
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Revise las casillas marcadas en rojo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#ff8000'
            });
        }
    });
});

