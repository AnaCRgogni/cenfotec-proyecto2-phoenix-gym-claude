$(document).ready(function () {
    console.log('Inside cliente.js');
    console.log(API_URL_BASE);
    $('#formCliente').submit(function (event) {
        event.preventDefault();

        var formData = {
            nombre: $('#nombre').val(),
            apellido1: $('#apellido1').val(),
            apellido2: $('#apellido2').val(),
            telefono: $('#telefono').val(),
            email: $('#email').val(),
            fechaNacimiento: $('#fechaNacimiento').val() + 'T00:00:00',
            contrasena: $('#contrasena').val(),
            fotoIdCliente: $('#fotoIdCliente').val(),
            fotoPerfilCliente: $('#fotoPerfilCliente').val(),
            generoCliente: $('#generoCliente').val(),
            matriculaCliente: parseFloat($('#matriculaCliente').val()),
            mensualidadCliente: parseFloat($('#mensualidadCliente').val()),
            fechaPagoCliente: $('#fechaPagoCliente').val() + 'T00:00:00',
            statusPagoCliente: $('#statusPagoCliente').val()
        };

        console.log(formData);
        console.log(JSON.stringify(formData));

        // Verifica que los datos sean válidos (opcional)
        if (validateFormData(formData)) {
            $.ajax({
                url: API_URL_BASE + '/Cliente/CreateCliente',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                dataType: 'json',
                success: function (response) {
                    console.log('Cliente creado exitosamente');
                },
                error: function (error) {
                    console.log(error.errors)
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, completar todos los campos requeridos correctamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
        }
    });



    function validateFormData(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key) && (data[key] === null || data[key] === '')) {
                return false;
            }
        }
        return true;
    }
});