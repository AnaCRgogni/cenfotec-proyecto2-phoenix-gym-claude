$(document).ready(function () {
    let myEvents = [];

    $('#evoCalendar').evoCalendar({
        calendarEvents: myEvents,
        format: 'yyyy-MM-dd',
        titleFormat: 'MM yyyy',
        eventHeaderFormat: 'MM d, yyyy',
        firstDayOfWeek: 0,
        todayHighlight: true,
        sidebarDisplayDefault: true,
        sidebarToggler: true,
        eventDisplayDefault: true,
        eventListToggler: true,
        language: 'es'
    });

    // Esto es solo para cuando se selecciona una fecha del calendario para llenar un input
    function formatDate(date, format) {
        var d = new Date(date),
            day = '' + d.getDate(),
            month = '' + (d.getMonth() + 1),
            year = d.getFullYear();

        if (day.length < 2) day = '0' + day;
        if (month.length < 2) month = '0' + month;

        if (format === 'yyyy-MM-dd') {
            return [year, month, day].join('-');
        } else {
            return [year, month, day].join('-');
        }
    }

    $('#evoCalendar').on('selectDate', function (event, newDate) {
        var formattedDate = formatDate(newDate, 'yyyy-MM-dd');
        $('#date').val(formattedDate);
    });

    function fetchAndDisplayEvents(cedula) {
        if (!cedula) {
            Swal.fire({
                title: 'Error',
                text: 'Cédula no proporcionada.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ff8000'
            });
            return;
        }

        $.ajax({
            url: `${API_URL_BASE}/CitasMedicion/GetCitasMedicion?cedula=${cedula}`,
            type: 'GET',
            success: function (data) {
                if (!data || data.length === 0) {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se encontraron eventos para la cédula proporcionada.',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });
                } else {
                    myEvents = data.map(event => {
                        return {
                            idEvo: event.idEvo,
                            cedula: event.cedula,
                            nombre: event.nombre,
                            apellido1: event.apellido1,
                            apellido2: event.apellido2,
                            description: event.description,
                            name: event.name,
                            date: event.date,
                            type: event.type,
                            everyYear: event.everyYear,
                            color: event.color
                        };
                    });
                    $('#evoCalendar').evoCalendar('addCalendarEvent', myEvents);
                    console.log('Eventos agregados al calendario:', myEvents);
                }
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error mostrando sus citas de medición.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error mostrando citas de medición.', error);
            }
        });
    }

    let cedula;

    if (sessionStorage.getItem('cedula')) {
        cedula = sessionStorage.getItem('cedula');
        console.log('Cédula recuperada de sessionStorage:', cedula);
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No se encontró su cédula.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff8000'
        });
    }

    // Si hay cedula en el session storage, corre la funcion para llenar el calendario
    if (cedula) {
        fetchAndDisplayEvents(cedula);
    }

    // Inicializar los botones como desactivados
    $('#deleteAppointment').prop('disabled', true).addClass('disabled');

    let selectedEventId;

    // Evento para habilitar los botones cuando se selecciona un evento
    $('#evoCalendar').on('selectEvent', function (event, selectedEvent) {
        selectedEventId = selectedEvent.idEvo;
        $('#deleteAppointment').prop('disabled', false).removeClass('disabled');
    });

    // Evento global para desactivar el boton de eliminar cuando se hace clic fuera de un evento
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.event-container').length && !$(e.target).closest('.deleteAppointment').length) {
            $('#deleteAppointment').prop('disabled', true).addClass('disabled');
            selectedEventId = null;
        }
    });

    function deleteCitaMedicionxCliente(idEvo) {
        $.ajax({
            url: `${API_URL_BASE}/CitasMedicion/GetCitasMedicionById?idEvo=${idEvo}`,
            type: 'GET',
            success: function (data) {
                var today = new Date();
                var eventDate = new Date(data.date);

                console.log(`Fecha de hoy: ${today}, Fecha del evento: ${eventDate}`)

                if (eventDate <= today) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pueden eliminar citas que sean el mismo día o en fechas pasadas.',
                        confirmButtonColor: '#ff8000'
                    });
                    return;
                } else {
                    $.ajax({
                        url: `${API_URL_BASE}/CitasMedicion/DeleteCitaMedicionxCliente?idEvo=${idEvo}`,
                        type: 'DELETE',
                        success: function () {
                            $('#evoCalendar').evoCalendar('removeCalendarEvent', idEvo);
                            Swal.fire({
                                icon: 'success',
                                title: 'Eliminado',
                                text: 'La cita de medición ha sido eliminada exitosamente.',
                                confirmButtonColor: '#ff8000'
                            });
                            console.log('Evento eliminado del calendario:', idEvo);
                        },
                        error: function (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Error eliminando su cita de medición.',
                                confirmButtonColor: '#ff8000'
                            });
                            console.error('Error eliminando la cita de medición.', {
                                idEvo: idEvo,
                                status: error.status,
                                statusText: error.statusText,
                                responseText: error.responseText
                            });
                        }
                    });
                }
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error obteniendo la cita de medición.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error obteniendo la cita de medición.', {
                    idEvo: idEvo,
                    status: error.status,
                    statusText: error.statusText,
                    responseText: error.responseText
                });
            }
        });
    }

    // Asignar la función de eliminación al botón con confirmación
    $('#deleteAppointment').click(function () {
        if (selectedEventId) {
            Swal.fire({
                title: 'Por favor, confirme que desea eliminar la cita de medición.',
                text: "Esta acción no se puede revertir.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff8000',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar la cita',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteCitaMedicionxCliente(selectedEventId);
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se seleccionó un ID del evento para eliminar.',
                confirmButtonColor: '#ff8000'
            });
        }
    });
});
