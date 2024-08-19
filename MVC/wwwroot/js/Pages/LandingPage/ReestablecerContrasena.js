$(document).ready(function () {
    const form = document.getElementById('resetPasswordForm');

    function togglePasswordVisibility(checkboxSelector, inputSelector) {
        $(checkboxSelector).on('change', function () {
            const passwordInput = $(inputSelector);
            const isChecked = $(this).is(':checked');
            passwordInput.attr('type', isChecked ? 'text' : 'password');
        });
    }

    togglePasswordVisibility('#showPassword1', '#password');
    togglePasswordVisibility('#showPassword2', '#confirmPassword');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const token = document.getElementById('token').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contrase�as no son iguales.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000' 
            });
            return;
        }

        let isValid = true;
        $(".form-control").removeClass("is-invalid");

        if (password === '') {
            $('#password').addClass('is-invalid');
            isValid = false;
        } else {
            const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~��])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~��]{8,}$/;
            if (!passwordPattern.test(password)) {
                $('#password').addClass('is-invalid');
                isValid = false;
            } else {
                $('#password').addClass('is-valid');
            }
        }

        if (!isValid) {
            Swal.fire({
                title: 'Error',
                text: 'Revise las casillas marcadas en rojo',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000' 
            });
            return;
        }

        const hasResult = await handlePassword(password);
        const salt = hasResult.salt;
        const hashedPassword = hasResult.hashedPassword;

        const data = {
            Token: token,
            Email: email,
            PasswordString: password,
            Password: hashedPassword,
            ConfirmPassword: hashedPassword,
            SaltValue: salt
        };

        $.ajax({
            url: `${API_URL_BASE}/Password/ResetPassword/reset-password`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                Swal.fire({
                    title: 'Cambio de contraseña exitoso',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ff8000', 
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
    });
});

