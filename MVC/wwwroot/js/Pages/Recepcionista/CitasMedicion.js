$(document).ready(function () {

    let rolUsuario = 'Entrenador';
    let tipoEntrenador = ['Entrenador de Piso', 'Ambos'];

    function loadTrainers() {
        $.ajax({
            url: `${API_URL_BASE}/Entrenador/GetEntrenadores?rolUsuario=${rolUsuario}`,
            type: 'GET',
            success: function (data) {
                let filteredTrainers = data.filter(trainer => tipoEntrenador.includes(trainer.tipoEntrenador));
                let trainerOptions = filteredTrainers.map(trainer => {
                    let nombreCompleto = `${trainer.nombre} ${trainer.apellido1} ${trainer.apellido2}`;
                    return `<option value="${trainer.nombre}|${trainer.apellido1}|${trainer.apellido2}|${nombreCompleto}">${nombreCompleto}</option>`;
                });

                $('#trainer').html(trainerOptions.join(''));
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error cargando entrenadores.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error cargando entrenadores.', error);
            }
        });
    }

    loadTrainers();

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
        $.ajax({
            url: `${API_URL_BASE}/CitasMedicion/GetCitasMedicion?cedula=${cedula}`,
            type: 'GET',
            data: { cedula: cedula },
            success: function (data) {
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
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error mostrando citas de medición.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error mostrando citas de medición.', error);
            }
        });
    }

    $('#submitCedula').click(function () {
        let cedula = $('#cedula').val();
        if (cedula === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, ingrese la cédula del cliente.',
                confirmButtonColor: '#ff8000'
            });
            return;
        }
        $('#cedula').prop('readonly', true).addClass('greyed-out');
        $('#submitCedula').prop('disabled', true).addClass('greyed-out');

        fetchAndDisplayEvents(cedula);
    });

    $('#resetCedula').click(function () {
        $('#cedula').val('').prop('readonly', false).removeClass('greyed-out');
        $('#submitCedula').prop('disabled', false).removeClass('greyed-out');
        $('#evoCalendar').evoCalendar('removeCalendarEvent', myEvents.map(event => event.idEvo));
        myEvents = [];
    });

    function generateUniqueId(date, hour) {
        let randomPart = Math.random().toString(36).substr(2, 9);
        return `${date}-${hour}-${randomPart}`;
    }

    $('#addAppointment').click(function () {
        let cedula = $('#cedula').val();
        if (cedula === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, ingrese la cédula del cliente.',
                confirmButtonColor: '#ff8000'
            });
            return;
        }

        let hour = $('#hour').val();
        let date = $('#date').val();
        let trainerInfo = $('#trainer').val().split('|');
        let nombre = trainerInfo[0];
        let apellido1 = trainerInfo[1];
        let apellido2 = trainerInfo[2];
        let nombreCompleto = trainerInfo[3];

        if (date === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, seleccione una fecha en el calendario.',
                confirmButtonColor: '#ff8000'
            });
            return;
        }

        let idEvo = generateUniqueId(date, hour);

        let newEvent = {
            idEvo: idEvo,
            cedula: cedula,
            nombre: nombre,
            apellido1: apellido1,
            apellido2: apellido2,
            description: `Cita de medición con el entrenador ${nombreCompleto}`,
            name: hour,
            date: date,
            type: 'DisponibilidadEntrenador',
            everyYear: false,
            color: '#04E90C'
        };

        $.ajax({
            url: `${API_URL_BASE}/CitasMedicion/CreateCitasMedicion`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newEvent),
            success: function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Cita agregada exitosamente.',
                    confirmButtonColor: '#ff8000'
                }).then(() => {
                    $('#evoCalendar').evoCalendar('removeCalendarEvent', myEvents.map(event => event.idEvo));
                    fetchAndDisplayEvents(cedula);
                });
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error agregando la cita de medición.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error agregando la cita de medición.', error);
            }
        });
    });

    $('#cancelAppointment').prop('disabled', true).addClass('disabled');

    $('#evoCalendar').on('selectEvent', function (event, selectedEvent) {
        selectedEventId = selectedEvent.idEvo;
        console.log('selectedEventId después de seleccionar un evento:', selectedEventId);
        $('#cancelAppointment').prop('disabled', false).removeClass('disabled');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.event-container').length && !$(e.target).closest('.cancelAppointment').length) {
            $('#cancelAppointment').prop('disabled', true).addClass('disabled');
            selectedEventId = null;
            console.log('selectedEventId después de clic global:', selectedEventId);
        }
    });

    function deleteCitaMedicionxRecepcionista(idEvo) {
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
                            console.error('Error eliminando la cita de medicion.', {
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
                console.error('Error obteniendo la cita de medicion.', {
                    idEvo: idEvo,
                    status: error.status,
                    statusText: error.statusText,
                    responseText: error.responseText
                });
            }
        });
    }
    $('#cancelAppointment').click(function () {
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
                    deleteCitaMedicionxRecepcionista(selectedEventId);
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se seleccionó un id del evento para eliminar.',
                confirmButtonColor: '#ff8000'
            });
        }
    });
});

