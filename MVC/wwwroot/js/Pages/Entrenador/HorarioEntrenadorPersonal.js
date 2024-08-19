$(document).ready(function () {
    let cedula = '';
    let myEvents = [];
    let tipoEntrenador = '';

    if (sessionStorage.getItem('cedula')) {
        cedula = sessionStorage.getItem('cedula');
        $('#cedula').val(cedula);
    }

    function determinarTipoEntrenador(cedula) {
        $.ajax({
            url: `${API_URL_BASE}/User/GetUsersValue?cedula=${cedula}`,
            type: 'GET',
            success: function (data) {
                tipoEntrenador = data.tipoEntrenador;
                if (tipoEntrenador === 'Entrenador Personal' || tipoEntrenador === 'Ambos') {
                    $('#mainContent').html(`
                        <div id="evoCalendar" class="calendar-container"></div>
                        <div class="form-container">
                            <p id="instructions">A continuación, puede añadir sus horas de disponibilidad en el calendario. Haga click en una hora del calendario para habilitar el botón de 'Eliminar Disponibilidad'.</p>
                            <form id="availabilityForm">
                                <div class="input-row">
                                    <div class="input-group">
                                        <label for="hour">Hora:</label>
                                        <select id="hour">
                                            ${generateHourOptions()}
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label for="date">Fecha (click en el calendario):</label>
                                        <input type="text" id="date" readonly>
                                    </div>
                                </div>
                                <div class="button-container">
                                    <button type="button" id="addAvailability" class="addAvailability">Agregar Disponibilidad</button>
                                    <button type="button" id="deleteAvailability" class="deleteAvailability" disabled>Eliminar Disponibilidad</button>
                                </div>
                            </form>
                        </div>
                    `);
                    initCalendar();
                } else {
                    $('#mainContent').html('<p class="info-text">Esta funcionalidad solo está disponible para entrenadores personales o mixtos.</p>');
                }
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error cargando la página.',
                    confirmButtonColor: '#ff8000'
                });
            }
        });
    }

    function generateHourOptions() {
        let options = '';
        for (let i = 6; i <= 22; i++) {
            let hour = i > 12 ? i - 12 : i;
            let period = i < 12 ? "am" : "pm";
            options += `<option value="${hour}:00 ${period}">${hour}:00 ${period}</option>`;
        }
        return options;
    }

    function initCalendar() {
        if (cedula !== '') {
            $.ajax({
                url: `${API_URL_BASE}/HorarioEntrenadorPersonal/GetHorarioEntrenadorPersonal?cedula=${cedula}`,
                type: 'GET',
                success: function (data) {
                    myEvents = data.map(event => {
                        return {
                            idEvo: event.idEvo,
                            name: event.name,
                            date: event.date,
                            type: event.type,
                            everyYear: event.everyYear,
                            color: event.color,
                            nombre: event.nombre,
                            apellido1: event.apellido1,
                            apellido2: event.apellido2,
                            description: event.description
                        };
                    });
                    $('#evoCalendar').evoCalendar('addCalendarEvent', myEvents);
                },
                error: function (error) {
                    console.error('Error mostrando disponibilidad.', error);
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Cédula no encontrada',
                text: 'Cédula no encontrada en el almacenamiento local.',
                confirmButtonColor: '#ff8000'
            });
        }

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

        $('#evoCalendar').on('selectDate', function (event, newDate) {
            var formattedDate = formatDate(newDate, 'yyyy-MM-dd');
            $('#date').val(formattedDate);
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

        function generateUniqueId(date, hour) {
            let randomPart = Math.random().toString(36).substr(2, 9);
            return `${date}-${hour}-${randomPart}`;
        }

        $('#addAvailability').click(function () {
            if (cedula === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Faltan datos para enviar la solicitud.',
                    text: 'No hay una cédula asociada a la cuenta.',
                    confirmButtonColor: '#ff8000'
                });
                return;
            }

            let hour = $('#hour').val();
            let date = $('#date').val();

            if (date === '') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Fecha no seleccionada.',
                    text: 'Por favor, seleccione una fecha en el calendario.',
                    confirmButtonColor: '#ff8000'
                });
                return;
            }

            // Asegurar que myEvents esté actualizado
            $.ajax({
                url: `${API_URL_BASE}/HorarioEntrenadorPersonal/GetHorarioEntrenadorPersonal?cedula=${cedula}`,
                type: 'GET',
                success: function (data) {
                    myEvents = data.map(event => {
                        return {
                            idEvo: event.idEvo,
                            name: event.name,
                            date: event.date.split('T'),
                            type: event.type,
                            everyYear: event.everyYear,
                            color: event.color,
                            nombre: event.nombre,
                            apellido1: event.apellido1,
                            apellido2: event.apellido2,
                            description: event.description
                        };
                    });

                    let exists = myEvents.some(event => event.date[0] === date && event.name === hour);

                    console.log('Eventos:', myEvents);
                    console.log('Fecha:', date);
                    console.log('Hora:', hour);
                    console.log('Existencia:', exists);

                    if (exists) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Hora ya disponible.',
                            text: 'Ya existe una disponibilidad para esta hora en la misma fecha.',
                            confirmButtonColor: '#ff8000'
                        });
                        return;
                    }

                    let idEvo = generateUniqueId(date, hour);

                    let newEvent = {
                        idEvo: idEvo,
                        cedula: cedula,
                        name: hour,
                        date: date,
                        type: 'Disponibilidad',
                        everyYear: false,
                        color: '#04E90C',
                        description: 'Hora disponible para entrenamiento personal.'
                    };

                    $.ajax({
                        url: `${API_URL_BASE}/HorarioEntrenadorPersonal/CreateHorarioEntrenadorPersonal`,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(newEvent),
                        success: function () {
                            Swal.fire({
                                title: 'Disponibilidad agregada',
                                text: '¿Desea agregar otra hora?',
                                icon: 'success',
                                showCancelButton: true,
                                confirmButtonColor: '#ff8000',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Sí',
                                cancelButtonText: 'No'
                            }).then((result) => {
                                if (!result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        },
                        error: function (error) {
                            console.error('Error guardando disponibilidad.', error);
                        }
                    });
                },
                error: function (error) {
                    console.error('Error obteniendo disponibilidad.', error);
                }
            });
        });

        $('#deleteAvailability').prop('disabled', true).addClass('disabled');

        let selectedEventId;

        $('#evoCalendar').on('selectEvent', function (event, selectedEvent) {
            selectedEventId = selectedEvent.idEvo;
            $('#deleteAvailability').prop('disabled', false).removeClass('disabled');
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.event-container').length && !$(e.target).closest('.deleteAvailability').length) {
                $('#deleteAvailability').prop('disabled', true).addClass('disabled');
                selectedEventId = null;
            }
        });

        function deleteHorarioEntrenadorPersonal(idEvo) {
            $.ajax({
                url: `${API_URL_BASE}/HorarioEntrenadorPersonal/GetHorarioEntrenadorById?idEvo=${idEvo}`,
                type: 'GET',
                success: function (data) {
                    var today = new Date();
                    var eventDate = new Date(data.date);

                    if (eventDate < today) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pueden eliminar horas de disponibilidad en fechas pasadas.',
                            confirmButtonColor: '#ff8000'
                        });
                        return;
                    }

                    if (data.color === '#FF0000') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pueden eliminar horas de disponibilidad reservadas por un cliente (en color rojo).',
                            confirmButtonColor: '#ff8000'
                        });
                        return;
                    }

                    $.ajax({
                        url: `${API_URL_BASE}/HorarioEntrenadorPersonal/DeleteHorarioEntrenadorPersonal?idEvo=${idEvo}`,
                        type: 'DELETE',
                        success: function () {
                            $('#evoCalendar').evoCalendar('removeCalendarEvent', idEvo);
                            Swal.fire({
                                icon: 'success',
                                title: 'Eliminado',
                                text: 'La disponibilidad ha sido eliminada exitosamente.',
                                confirmButtonColor: '#ff8000'
                            });
                        },
                        error: function (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Error eliminando su hora de disponibilidad.',
                                confirmButtonColor: '#ff8000'
                            });
                            console.error('Error eliminando la hora de disponibilidad.', error);
                        }
                    });
                },
                error: function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error obteniendo la hora de disponibilidad.',
                        confirmButtonColor: '#ff8000'
                    });
                    console.error('Error obteniendo los detalles de la hora de disponibilidad.', error);
                }
            });
        }

        $('#deleteAvailability').click(function () {
            if (selectedEventId) {
                Swal.fire({
                    title: 'Por favor, confirme que desea eliminar la hora de disponibilidad.',
                    text: "Esta acción no se puede revertir. Deberá añadir la hora de nuevo.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ff8000',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Eliminar la disponibilidad',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteHorarioEntrenadorPersonal(selectedEventId);
                    }
                });
            }
        });
    }

    determinarTipoEntrenador(cedula);
});

