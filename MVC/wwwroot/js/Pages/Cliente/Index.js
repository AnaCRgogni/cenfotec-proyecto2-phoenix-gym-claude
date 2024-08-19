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
                    text: 'No se pudo obtener el nombre de usuario.',
                    confirmButtonColor: '#ff8000'
                });
            }
        });

        // Obtener las citas de medición
        $.ajax({
            url: `${API_URL_BASE}/CitasMedicion/GetCitasMedicion?cedula=${cedula}`,
            type: 'GET',
            success: function (data) {
                if (data && data.length > 0) {
                    console.log(`Citas de medición obtenidas: ${JSON.stringify(data)}`);

                    let lastAppointmentDate = new Date(Math.max(...data.map(event => new Date(event.date))));
                    console.log(`Fecha de la última cita: ${lastAppointmentDate}`);

                    let currentDate = new Date();
                    console.log(`Fecha actual: ${currentDate}`);

                    let differenceInWeeks = Math.floor((currentDate - lastAppointmentDate) / (1000 * 60 * 60 * 24 * 7));
                    console.log(`Semanas transcurridas desde la última cita: ${differenceInWeeks}`);

                    if (differenceInWeeks >= 6) {
                        let suggestedDate = new Date(lastAppointmentDate);
                        suggestedDate.setDate(suggestedDate.getDate() + 56); // Añadir 8 semanas (56 días)
                        let formattedDate = suggestedDate.toISOString().split('T')[0];
                        console.log(`Fecha sugerida para la próxima cita: ${formattedDate}`);

                        $('#alert-banner').html(`
                            <div class="alert-banner">
                                Alerta: Ya han pasado 6 semanas desde su última cita de medición. 
                                Recomendamos tener citas de medición cada 2 meses. 
                                Por favor, acérquese a recepción para reservarle una nueva cita. 
                                La fecha recomendada es: ${formattedDate}.
                            </div>
                        `).show();
                    }
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin citas encontradas',
                        text: 'No se encontraron citas de medición para la cédula proporcionada.',
                        confirmButtonColor: '#ff8000'
                    });
                    console.log('No se encontraron citas de medición para la cédula proporcionada.');
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error cargando citas de medición.',
                    confirmButtonColor: '#ff8000'
                });
                console.log('Error cargando citas de medición.');
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró su cédula.',
            confirmButtonColor: '#ff8000'
        });
        console.log('Cédula no encontrada en sessionStorage.');
    }
});

