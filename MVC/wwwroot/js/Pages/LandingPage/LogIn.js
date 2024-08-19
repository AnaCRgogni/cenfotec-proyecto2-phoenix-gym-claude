$(document).ready(function () {

    const forms = $('.needs-validation');

    $('#showPassword').on('change', function () {
        var passwordInput = $('#contrasena');
        var isChecked = $(this).is(':checked');
        if (isChecked) {
            passwordInput.attr('type', 'text');
        } else {
            passwordInput.attr('type', 'password');
        }
    });

    $('#formLogIn').submit(function (event) {
        event.preventDefault();
        var isValid = true;
        $(".form-control").removeClass("is-invalid");
        var email = $("#email").val().trim();
        var contrasena = $("#contrasena").val().trim();
        // Validar el campo de email
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
        // Validar el campo de contraseña
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
        if (isValid) {
            $.ajax({
                url: `${API_URL_BASE}/LogIn/LogIn?email=${encodeURIComponent(email)}&password=${encodeURIComponent(contrasena)}`,
                method: 'GET',
                success: function (response, textStatus, xhr) {

                    //console.log(response);

                    if (xhr.responseJSON.statusCode === '412') {
                        Swal.fire({
                            title: 'Error',
                            text: xhr.responseJSON.message,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        });

                    } else if (xhr.responseJSON.statusCode === '413') {
                        Swal.fire({
                            title: 'Error',
                            text: xhr.responseJSON.message,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        });

                    } else if (xhr.responseJSON.statusCode === '500') {
                        Swal.fire({
                            title: 'Error',
                            text: 'Unkown error',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        });
                    } else {

                        $.ajax({
                            url: `${API_URL_BASE}/Password/GetLoggedUser?email=${encodeURIComponent(email)}`,
                            method: 'GET',
                            success: function (user) {
                                Swal.fire({
                                    title: 'Inicio de sesión fue exitoso.',
                                    icon: 'success',
                                    confirmButtonText: 'Ok',
                                    confirmButtonColor: '#ff8000'
                                }).then(() => {
                                    if (user.estado === 'True') {
                                        sessionStorage.setItem('correo', user.email);
                                        sessionStorage.setItem('rol', user.rolUsuario);
                                        sessionStorage.setItem('cedula', user.cedula);
                                        sessionStorage.setItem('estado', user.estado);
                                        if (user.rolUsuario === 'Cliente') {
                                            window.location.href = `${URL_BASE}/Cliente/Index`;
                                        } else if (user.rolUsuario === 'Administrador') {
                                            window.location.href = `${URL_BASE}/Administrador/Index`;
                                        } else if (user.rolUsuario === 'Entrenador') {
                                            window.location.href = `${URL_BASE}/Entrenador/Index`;
                                        } else if (user.rolUsuario === 'Recepcionista') {
                                            window.location.href = `${URL_BASE}/Recepcionista/Index`;
                                        }
                                    } else {
                                        Swal.fire({
                                            title: 'Error',
                                            text: 'Su cuenta no ha sido activada aún.',
                                            icon: 'error',
                                            confirmButtonText: 'Ok',
                                            confirmButtonColor: '#ff8000'
                                        });
                                    }
                                });
                            }
                        });
                    }
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Revise datos de inicio de sesión.',
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
});