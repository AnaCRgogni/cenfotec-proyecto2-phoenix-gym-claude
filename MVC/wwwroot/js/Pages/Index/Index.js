$(document).ready(function () {
    var cedula = sessionStorage.getItem('cedula');

    if (cedula) {
        console.log(`Cédula obtenida de sessionStorage: ${cedula}`);

        // Obtener el nombre del usuario
        $.ajax({
            url: `${API_URL_BASE}/User/GetUserNameByCedula?cedula=${cedula}`,
            method: 'GET',
            success: function (data) {
                var nombreCompleto = `${data.nombre} ${data.apellido1} ${data.apellido2}`;
                $('#user-name').text(nombreCompleto);
                console.log(`Nombre del usuario: ${nombreCompleto}`);
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener el nombre del usuario.',
                });
            }
        });
    }
});
