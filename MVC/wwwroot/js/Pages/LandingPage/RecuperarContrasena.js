document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('recoverPasswordForm');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = $("#email").val().trim();

        if (!email) {
            Swal.fire({
                title: 'Error',
                text: 'Correo requerido.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000' 
            });
            return;
        }

        const data = {
            token: "",
            email: email,
            passwordString: "",
            password: "",
            confirmPassword: "",
            saltValue: ""
        };

        const url = `${API_URL_BASE}/Password/RecoverPassword/recover-password`;

        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                Swal.fire({
                    title: 'Un correo para recuperar su contraseña ha sido enviado.',
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
                    text: 'Ocurrió un error. Por favor, intente de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ff8000' 
                });
            }
        });
    });
});

