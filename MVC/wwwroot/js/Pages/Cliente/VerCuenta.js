//Cliente
function formatDateString(dateTimeString) {
    // Create a Date object from the datetime string
    const date = new Date(dateTimeString);

    // Get the year, month, and day
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);

    // Return the date in yyyy-MM-dd format
    return `${year}-${month}-${day}`;
}

$(document).ready(async function () {
    const email = sessionStorage.getItem('correo');
    var cliente = $.ajax({
        url: `${API_URL_BASE}/Cliente/GetClienteByEmail?email=${encodeURIComponent(email)}`,
        method: 'GET',
        success: function (user) {
            $("#nombre").val(user.nombre.toString());
            $("#apellido1").val(user.apellido1.toString());
            $("#apellido2").val(user.apellido2.toString());
            $("#telefono").val(user.telefono.toString());
            $("#email").val(user.email.toString());
            $("#fechaNacimiento").val(formatDateString(user.fechaNacimiento));
            $("#imgFotoCedula").attr('src', user.fotoIdCliente.toString());
            $("#imgFotoPerfil").attr('src', user.fotoPerfilCliente.toString());

            $("#cedula").val(user.cedula.toString());
            $("#generoCliente").val(user.generoCliente.toString());
            $('#updateBtn').on('click', async function (event) {
                event.preventDefault();
                var isValid = true;
                $(".form-control").removeClass("is-invalid");
                var email = $("#email").val().trim();
                var fotoPerfilCliente = $("#fotoPerfilCliente")[0];

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

                if (isValid) {
                    var updatedCliente = {};
                    if (fotoPerfilCliente.files.length === 0) {
                        var email = $("#email").val().trim();
                        updatedCliente.cedula = user.cedula;
                        updatedCliente.nombre = user.nombre;
                        updatedCliente.apellido1 = user.apellido1;
                        updatedCliente.apellido2 = user.apellido2;
                        updatedCliente.email = email;
                        updatedCliente.contrasena = user.contrasena;
                        updatedCliente.telefono = user.telefono;
                        updatedCliente.fechaNacimiento = user.fechaNacimiento;
                        updatedCliente.fotoIdCliente = user.fotoIdCliente;
                        updatedCliente.fotoPerfilCliente = user.fotoPerfilCliente;
                        updatedCliente.generoCliente = user.generoCliente.toString();
                        updatedCliente.idMembresia = user.idMembresia;
                        updatedCliente.estado = user.estado;
                        console.log(updatedCliente);

                    } else {

                        var filePerfil = fotoPerfilCliente.files[0];
                        var formDataProfile = new FormData();
                        formDataProfile.append('file', filePerfil);
                        var filePerfilImageUrl = await uploadToCloudinary(formDataProfile);

                        var email = $("#email").val().trim();
                        updatedCliente.cedula = user.cedula;
                        updatedCliente.nombre = user.nombre;
                        updatedCliente.apellido1 = user.apellido1;
                        updatedCliente.apellido2 = user.apellido2;
                        updatedCliente.email = email;
                        updatedCliente.contrasena = user.contrasena;
                        updatedCliente.telefono = user.telefono;
                        updatedCliente.fechaNacimiento = user.fechaNacimiento;
                        updatedCliente.fotoIdCliente = user.fotoIdCliente;
                        updatedCliente.fotoPerfilCliente = filePerfilImageUrl;
                        updatedCliente.generoCliente = user.generoCliente.toString();
                        updatedCliente.idMembresia = user.idMembresia;
                        updatedCliente.estado = user.estado;
                        console.log(updatedCliente);
                    }

                    $.ajax({
                        url: `${API_URL_BASE}/Cliente/UpdateCliente`,
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(updatedCliente),
                        success: function (response, textStatus, xhr) {
                            if (xhr.responseJSON.statusCode === '401') {
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'El correo ya está en uso.',
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                    confirmButtonColor: '#ff8000' 
                                });

                            } else if (xhr.responseJSON.statusCode === '402') {
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'La cédula ya está en uso',
                                    icon: 'error',
                                    confirmButtonText: 'Ok',
                                    confirmButtonColor: '#ff8000' 
                                });

                            } else {
                                sessionStorage.setItem('correo', xhr.responseJSON.content);
                                Swal.fire({
                                    title: 'Datos actualizados.',
                                    icon: 'success',
                                    confirmButtonText: 'Ok',
                                    allowOutsideClick: false, // Prevent closing by clicking outside
                                    showCancelButton: false, // Hide cancel button (X)
                                    allowEscapeKey: false, // Prevent closing by pressing Esc
                                    showConfirmButton: true, // Show confirm button (OK)
                                    confirmButtonText: "OK",
                                    confirmButtonColor: '#ff8000' 
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        // Reload the page
                                        window.location.reload();
                                    }
                                });
                            }
                        },
                        error: function (error) {
                            console.log(error);
                            Swal.fire({
                                title: 'Error',
                                text: 'Error al actualizar los datos. Inténtelo de nuevo más tarde.',
                                icon: 'error',
                                confirmButtonText: 'Ok',
                                confirmButtonColor: '#ff8000' 
                            });
                        }
                    });

                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Revise las casillas marcadas en rojo',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000' 
                    });
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar la información del cliente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000' 
            });
        }
    });

    console.log(cliente);

    $('#LogOutBtn').on('click', async function (event) {
        event.preventDefault();

        // Borrar toda la informacion del sessionStorage
        sessionStorage.clear();

        window.location.href = `${URL_BASE}/LandingPage/LandingPage`;
    });
});

