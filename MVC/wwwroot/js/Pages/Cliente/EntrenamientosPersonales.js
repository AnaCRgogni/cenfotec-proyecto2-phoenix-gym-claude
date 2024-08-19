$(document).ready(function () {

    let rolUsuario = 'Entrenador';
    let tipoEntrenador = ['Entrenador Personal', 'Ambos'];
    let trainersData = [];
    let cedulaEntrenador;
    let myEvents = [];
    let selectedEventId;
    let cedulaCliente = '';

    if (sessionStorage.getItem('cedula')) {
        cedulaCliente = sessionStorage.getItem('cedula');
    }

    function loadTrainers() {
        $.ajax({
            url: `${API_URL_BASE}/Entrenador/GetEntrenadores?rolUsuario=${rolUsuario}`,
            type: 'GET',
            success: function (data) {
                trainersData = data.filter(trainer => tipoEntrenador.includes(trainer.tipoEntrenador));
                let trainerOptions = trainersData.map(trainer => {
                    let nombreCompleto = `${trainer.nombre} ${trainer.apellido1} ${trainer.apellido2}`;
                    return `<option value="${trainer.cedula}">${nombreCompleto}</option>`;
                });

                $('#trainer').html('<option value="" disabled selected>Seleccione un entrenador para mostrar su información personal</option>' + trainerOptions.join(''));
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

    $('#trainer').on('change', function () {
        let selectedTrainerId = $(this).val();
        let selectedTrainer = trainersData.find(trainer => trainer.cedula == selectedTrainerId);

        if (selectedTrainer) {
            cedulaEntrenador = selectedTrainer.cedula;
            console.log('Cédula del entrenador seleccionado:', cedulaEntrenador);
        }

        $.ajax({
            url: `${API_URL_BASE}/User/GetUsersValue?cedula=${cedulaEntrenador}`,
            method: 'GET',
            success: function (entrenador) {
                console.log('Información del entrenador obtenida:', entrenador);
                $("#telefono").val(entrenador.telefono.toString());
                $("#email").val(entrenador.email.toString());
                let formattedTarifaHora = parseFloat(entrenador.tarifaHoraEntrenadorPersonal).toFixed(2);
                $("#tarifaHora").val(formattedTarifaHora);
            },
            error: function (err) {
                console.error('Error al obtener la información del entrenador:', err);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al obtener la información del entrenador.',
                    icon: 'error',
                    confirmButtonColor: '#ff8000'
                });
            }
        });

        fetchAndDisplayEvents(cedulaEntrenador);
    });

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

    function fetchAndDisplayEvents(cedula) {
        if (myEvents && myEvents.length > 0) {
            myEvents.forEach(event => {
                $('#evoCalendar').evoCalendar('removeCalendarEvent', event.idEvo);
            });
        }

        $.ajax({
            url: `${API_URL_BASE}/HorarioEntrenadorPersonal/GetHorarioEntrenadorPersonal?cedula=${cedula}`,
            type: 'GET',
            success: function (data) {
                myEvents = data.map(event => {
                    return {
                        idEvo: event.idEvo,
                        cedula: event.cedula,
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

    // Inicializar los botones como desactivados
    $('#cancelAppointment').prop('disabled', true).addClass('disabled');
    $('#bookAppointment').prop('disabled', true).addClass('disabled');

    // Evento para habilitar los botones cuando se selecciona un evento
    $('#evoCalendar').on('selectEvent', function (event, selectedEvent) {
        selectedEventId = selectedEvent.idEvo;
        console.log('selectedEventId después de seleccionar un evento:', selectedEventId);
        $('#cancelAppointment').prop('disabled', false).removeClass('disabled');
        $('#bookAppointment').prop('disabled', false).removeClass('disabled');
    });

    // Evento global para desactivar el boton de eliminar cuando se hace clic fuera de un evento
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.event-container').length && !$(e.target).closest('.cancelAppointment').length && !$(e.target).closest('.bookAppointment').length && !$(e.target).closest('.swal2-container').length) {
            $('#cancelAppointment').prop('disabled', true).addClass('disabled');
            $('#bookAppointment').prop('disabled', true).addClass('disabled');
            selectedEventId = null;
            console.log('selectedEventId después de clic global:', selectedEventId);
        }
    });

    function getClienteInfo(cedulaCliente) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${API_URL_BASE}/User/GetUsersValue?cedula=${cedulaCliente}`,
                method: 'GET',
                success: function (cliente) {
                    resolve({
                        nombre: cliente.nombre,
                        apellido1: cliente.apellido1,
                        apellido2: cliente.apellido2,
                    });
                },
                error: function (error) {
                    console.error('Error al obtener la información del cliente:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error al obtener la información del cliente.',
                        icon: 'error',
                        confirmButtonColor: '#ff8000'
                    });
                    reject(error);
                }
            });
        });
    }

    function updateReserva(selectedEventId, nombre, apellido1, apellido2, description) {
        console.log('Iniciando solicitud PUT');
        console.log('selectedEventId dentro de update reserva con url: ', selectedEventId);
        console.log('Encoded: ', encodeURIComponent(selectedEventId));

        return $.ajax({
            url: `${API_URL_BASE}/HorarioEntrenadorPersonal/UpdateHorarioEntrenadorCliente/${encodeURIComponent(selectedEventId)}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                idEvo: selectedEventId,
                color: '#FF0000',
                nombre: nombre,
                apellido1: apellido1,
                apellido2: apellido2,
                description: description,
            }),
            success: function (data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reservado',
                    text: 'La reserva se realizó con éxito.',
                    confirmButtonColor: '#ff8000'
                });
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error haciendo la reserva.',
                    confirmButtonColor: '#ff8000'
                });
                console.error('Error haciendo la reserva:', error);
            }
        });
    }

    $('#bookAppointment').click(function () {
        if (selectedEventId) {
            let selectedEvent = myEvents.find(event => event.idEvo === selectedEventId);

            // Validar si la fecha del evento es hoy o en el futuro
            let eventDate = new Date(selectedEvent.date);
            let today = new Date();
            today.setHours(0, 0, 0, 0); 

            if (eventDate < today) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pueden hacer reservas para fechas pasadas.',
                    confirmButtonColor: '#ff8000'
                });
                return;
            }

            // Validar si el evento ya está reservado
            if (selectedEvent && selectedEvent.color === '#FF0000') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La cita ya ha sido reservada.',
                    confirmButtonColor: '#ff8000'
                });
            } else {
                Swal.fire({
                    title: 'Por favor, confirme que desea reservar esta hora de entrenamiento personal.',
                    text: "Puede cancelar la reservación hasta 24 horas antes.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ff8000',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Reservar Entrenamiento',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        getClienteInfo(cedulaCliente).then(clienteInfo => {
                            const nombreCompleto = `${clienteInfo.nombre} ${clienteInfo.apellido1} ${clienteInfo.apellido2}`;
                            const description = `Entrenamiento reservado para el cliente ${nombreCompleto}`;
                            console.log('clienteInfo:', clienteInfo, description);
                            updateReserva(selectedEventId, clienteInfo.nombre, clienteInfo.apellido1, clienteInfo.apellido2, description)
                                .then(() => {
                                    fetchAndDisplayEvents(cedulaEntrenador);
                                })
                                .catch((error) => {
                                    console.error('Error actualizando reserva:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Hubo un error al realizar la reserva.',
                                        confirmButtonColor: '#ff8000'
                                    });
                                });
                        });
                    }
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se seleccionó un evento para reservar.',
                confirmButtonColor: '#ff8000'
            });
        }
    });


    function cancelReserva(selectedEventId, nombre, apellido1, apellido2, description) {
        console.log('Iniciando solicitud PUT');
        console.log('selectedEventId dentro de cancel reserva con url: ', selectedEventId);
        console.log('Encoded: ', encodeURIComponent(selectedEventId));

        let selectedEvent = myEvents.find(event => event.idEvo === selectedEventId);

        if (selectedEvent && selectedEvent.color === '#FF0000') {
            return $.ajax({
                url: `${API_URL_BASE}/HorarioEntrenadorPersonal/UpdateCancelHorarioEntrenadorCliente/${encodeURIComponent(selectedEventId)}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    idEvo: selectedEventId,
                    color: '#04E90C',
                    nombre: nombre,
                    apellido1: apellido1,
                    apellido2: apellido2,
                    description: description,
                }),
                success: function (data) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Entrenamiento cancelado',
                        text: 'La cancelación se realizó con éxito.',
                        confirmButtonColor: '#ff8000'
                    }).then(() => {
                        fetchAndDisplayEvents(cedulaEntrenador);
                    });
                },
                error: function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error haciendo la cancelación.',
                        confirmButtonColor: '#ff8000'
                    });
                    console.error('Error haciendo la cancelación:', error);
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se puede cancelar una cita que no está reservada.',
                confirmButtonColor: '#ff8000'
            });
        }
    }

    $('#cancelAppointment').click(function () {
        if (selectedEventId) {
            let selectedEvent = myEvents.find(event => event.idEvo === selectedEventId);

            // Validar que la cita puede cancelarse hasta el dia anterior
            let eventDate = new Date(selectedEvent.date);
            let today = new Date();
            today.setHours(0, 0, 0, 0); 

            if (eventDate <= today) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se puede cancelar una cita el mismo día o después de la fecha.',
                    confirmButtonColor: '#ff8000'
                });
                return;
            }

            // Validar que el usuario esté cancelando su propia reserva
            getClienteInfo(cedulaCliente).then(clienteInfo => {
                const nombreCompletoCliente = `${clienteInfo.nombre} ${clienteInfo.apellido1} ${clienteInfo.apellido2}`;
                const nombreCompletoEvento = `${selectedEvent.nombre} ${selectedEvent.apellido1} ${selectedEvent.apellido2}`;

                if (nombreCompletoCliente !== nombreCompletoEvento) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se puede cancelar una reserva de otro cliente.',
                        confirmButtonColor: '#ff8000'
                    });
                    return;
                }

                if (selectedEvent && selectedEvent.color === '#FF0000') {
                    Swal.fire({
                        title: '¿Está seguro de que desea cancelar esta hora de entrenamiento personal?',
                        text: "La hora será marcada como disponible nuevamente.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ff8000',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Cancelar Entrenamiento',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const description = 'Hora disponible para entrenamiento personal';
                            cancelReserva(selectedEventId, clienteInfo.nombre, clienteInfo.apellido1, clienteInfo.apellido2, description)
                                .then(() => {
                                    fetchAndDisplayEvents(cedulaEntrenador);
                                })
                                .catch((error) => {
                                    console.error('Error actualizando la cancelación:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Hubo un error al cancelar la reserva.',
                                        confirmButtonColor: '#ff8000'
                                    });
                                });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La hora no puede ser cancelada porque no está reservada.',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se seleccionó un evento para cancelar.',
                confirmButtonColor: '#ff8000'
            });
        }
    });
});



