//Administrador
$(document).ready(async function () {
    const cedula = sessionStorage.getItem('cedula');
    var cliente = $.ajax({
        url: `${API_URL_BASE}/User/GetUserNameByCedula?cedula=${cedula}`,
        method: 'GET',
        success: function (user) {
            $("#nombre").val(user.nombre.toString());
            $("#apellido1").val(user.apellido1.toString());
            $("#apellido2").val(user.apellido2.toString());
            $("#email").val(user.email.toString());
            $("#cedula").val(user.cedula.toString());
            $("#telefono").val(user.telefono.toString());
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar su información.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }
    });

    $('#LogOutBtn').on('click', async function (event) {
        event.preventDefault();

        // Borrar toda la informacion del sessionStorage
        sessionStorage.clear();

        window.location.href = `${URL_BASE}/LandingPage/LandingPage`;
    });
});
