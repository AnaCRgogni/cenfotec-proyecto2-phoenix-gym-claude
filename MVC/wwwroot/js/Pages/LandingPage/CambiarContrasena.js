$(document).ready(function () {
    const email = sessionStorage.getItem('correo');
    const form = document.getElementById('formCambiarContrasena');

    function togglePasswordVisibility(checkboxSelector, inputSelector) {
        $(checkboxSelector).on('change', function () {
            const passwordInput = $(inputSelector);
            const isChecked = $(this).is(':checked');
            passwordInput.attr('type', isChecked ? 'text' : 'password');
        });
    }
    togglePasswordVisibility('#showPassword1', '#contrasenaActual');
    togglePasswordVisibility('#showPassword2', '#contrasenaNueva');
    togglePasswordVisibility('#showPassword3', '#confirmacionContrasena');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const currentPassword = document.getElementById('contrasenaActual').value;
        const newPassword = document.getElementById('contrasenaNueva').value;
        const confirmPassword = document.getElementById('confirmacionContrasena').value;

        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
            return;
        }

        let isValid = true;
        $(".form-control").removeClass("is-invalid");

        if (newPassword === '') {
            $('#contrasenaNueva').addClass('is-invalid');
            isValid = false;
        } else {
            const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~¡¿])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~¡¿]{8,}$/;
            if (!passwordPattern.test(newPassword)) {
                $('#contrasenaNueva').addClass('is-invalid');
                isValid = false;
            } else {
                $('#contrasenaNueva').addClass('is-valid');
            }
        }

        if (!isValid) {
            Swal.fire({
                title: 'Error',
                text: 'Revise las casillas marcadas en rojo.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
            return;
        }

        const hasResult = await handlePassword(newPassword);
        salt = hasResult.salt;
        hashedContra = hasResult.hashedPassword;

        const data = {
            Token: "", // token no necesario
            Email: email,
            PasswordString: newPassword,
            Password: hashedContra,
            ConfirmPassword: hashedContra,
            SaltValue: salt
        };

        if (isValid) {
            $.ajax({
                url: `${API_URL_BASE}/Password/AuthenticatePassword/authenticate-password?email=${encodeURIComponent(email)}&password=${encodeURIComponent(currentPassword)}`,
                method: 'GET',
                success: function (logInResponse) {
                    if (logInResponse) {
                        $.ajax({
                            url: `${API_URL_BASE}/Password/ChangePassword/change-password`,
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(data),
                            success: function (response) {
                                Swal.fire({
                                    title: 'Cambio de contraseña fue exitoso.',
                                    icon: 'success',
                                    confirmButtonText: 'OK',
                                    allowOutsideClick: false,
                                    showCancelButton: false,
                                    allowEscapeKey: false,
                                    showConfirmButton: true
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        window.location.href = 'https://localhost:7021';
                                    }
                                });
                            },
                            error: function (xhr, status, error) {
                                console.error('Error:', error);
                                Swal.fire({
                                    title: 'Error',
                                    text: xhr.responseJSON?.message || 'Ocurrió un error',
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                    confirmButtonColor: '#ff8000' 
                                });
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Su usuario no pasó la autenticación',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#ff8000'
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrió un error',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
        }
    });
});

