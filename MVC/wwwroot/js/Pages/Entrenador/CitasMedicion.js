$(document).ready(function () {
    let myEvents = [];
    const contenedorUsuario = document.getElementById('formCliente');
    let fechaNacimiento;
    let cedulaCliente;
    let cedulaEntrenador = sessionStorage.getItem('cedula');

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

    // Esta funcion llena el calendario usando el description como filtro porque tiene el nombre del entrenador 
    // (asignado por recepcionista)
    function fetchAndDisplayEvents(description) {
        let encodedDescription = encodeURIComponent(description);
        $.ajax({
            url: `${API_URL_BASE}/CitasMedicion/GetCitasMedicionForEntrenador?description=${encodedDescription}`,
            type: 'GET',
            success: function (data) {
                myEvents = data.map(event => {
                    return {
                        idEvo: event.idEvo,
                        cedula: event.cedula,
                        nombre: event.nombre,
                        apellido1: event.apellido1,
                        apellido2: event.apellido2,
                        // Si muestra esto, va a ser el description de la tabla del lado recepcionista
                        // Agregue el form con la info de cliente en vez de meter otro description a la tabla
                        description: '',
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

    if (sessionStorage.getItem('cedula')) {
        cedula = sessionStorage.getItem('cedula');
    }

    // Esta funcion toma la cedula del session storage y se trae el nombre del entrenador para crear un 
    // description que haga match con los que este entrenador debe tener asignados en el calendario
    function getDescriptionName(cedula) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${API_URL_BASE}/User/GetUserNameByCedula?cedula=${cedula}`,
                type: 'GET',
                success: function (data) {
                    let nombreCompleto = `${data.nombre} ${data.apellido1} ${data.apellido2}`;
                    let description = `Cita de medición con el entrenador ${nombreCompleto}`;
                    console.log(description);
                    resolve(description);
                },
                error: function (error) {
                    console.error('Error mostrando citas de medición.', error);
                    reject(error);
                }
            });
        });
    }

    // Llamado de la función con la promesa para pasar el parámetro del resolve a fetchAndDisplayEvents
    getDescriptionName(cedula)
        .then(description => {
            return fetchAndDisplayEvents(description);
        })
        .then(() => {
            console.log('Eventos recuperados:', myEvents);
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error === 'No se encontró su cédula en la base de datos.' ? error : 'Error mostrando las citas de medición.',
                confirmButtonColor: '#ff8000'
            });
            console.error(error);
        });

    function calcularEdad(fechaNacimiento) {
        var fechaNacimientoDate = new Date(fechaNacimiento);

        // fecha actual
        var fechaActual = new Date();

        //Calcula la edad en annos
        var edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();

        //Calculo para ver si el mes ya se cumplio o no 
        var mesNacimiento = fechaNacimientoDate.getMonth();
        var diaNacimiento = fechaNacimientoDate.getDate();
        var mesActual = fechaActual.getMonth();
        var diaActual = fechaActual.getDate();

        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edad--;
        }

        return edad;
    }

    function validateText(text, elementSelector) { // Se llama así: validateElement(machineName, '#machineName');
        const element = $(elementSelector);

        if (text === '') {
            element.removeClass('is-valid').addClass('is-invalid');
            return false;
        } else {
            element.removeClass('is-invalid').addClass('is-valid');
            return true;
        }
    };

    function validateNumber(number, elementSelector) {
        const element = $(elementSelector);

        // Verifica si el número es NaN o si es menor o igual a cero
        if (isNaN(number) || number <= 0) {
            element.removeClass('is-valid').addClass('is-invalid');
            return false;
        } else {
            element.removeClass('is-invalid').addClass('is-valid');
            return true;
        }
    }

    function getFormattedDateForSQL() {
        // Fecha de hoy
        let today = new Date();

        //Cambio a formato para sql
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
        let day = String(today.getDate()).padStart(2, '0');

        // Crea la cadena con el formato "YYYY-MM-DD"
        let formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    }

    $(document).on('click', '#sendBtn', function (event) {
        event.preventDefault(); // Prevenir el envío del formulario si es necesario

        var peso = parseFloat($("#peso").val().trim());
        var altura = parseFloat($("#altura").val().trim());

        var isValid = true;

        // Validar campos
        if (!validateNumber(peso, '#peso')) {
            isValid = false;
        }

        if (!validateNumber(altura, '#altura')) {
            isValid = false;
        }

        if (isValid) {
            const fecha = getFormattedDateForSQL();
            const contenedorResultado = document.getElementById('resultadosMedicion');
            var button = document.getElementById('sendBtn');
            button.style.display = 'none';  // Oculta el botón
            event.preventDefault();
            var edad = calcularEdad(fechaNacimiento);

            const divMedicion = document.createElement('div');
            var imc = Math.round(peso / Math.pow(altura, 2));
            var igc = Math.round((1.20 * imc) + (0.23 * edad) - 5.4);

            const medicion = {};
            medicion.fecha = fecha;
            medicion.peso = peso;
            medicion.altura = altura;
            medicion.idUsuario = cedulaEntrenador;
            medicion.idCliente = cedulaCliente;
            medicion.imc = imc;
            medicion.igc = igc;

            console.log("JSON MEDICION:\n" + JSON.stringify(medicion));

            $.ajax({
                url: `${API_URL_BASE}/Medicion/CreateMedicion`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(medicion),
                success: function () {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Medición guardada.',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#ff8000'
                    });

                },
                error: function (error) {
                    console.error('Error:', error);
                }

            });

            divMedicion.innerHTML = `
        <div class="row">
            <div class="col-md-6 form-group">
                <label for="apellido2">Indice Masa Muscular</label>
                <input type="text" class="form-control" value="${imc}%" id="imc" disabled />
            </div>
            <div class="col-md-6 form-group">
                <label for="telefono">Indice Grasa Corporal</label>
                <input type="text" class="form-control" value="${igc}%" id="igc" disabled />
            </div>
            <button type="submit" class="btn btn-orange" id="finBtn">Finalizar Cita</button>
        </div>
        `;
            contenedorResultado.appendChild(divMedicion);

        } else {
            Swal.fire({
                title: 'Error',
                text: 'Llene los datos marcados en rojo.',
                icon: 'error',
                confirmButtonColor: '#ff8000'
            });
        }


       
    });

    $(document).on('click', '#finBtn', function (event) {
        window.location.reload();
    });

    // Agregar evento de selección de evento
    $('#evoCalendar').on('selectEvent', function (event, selectedEvent) {
        console.log('Evento seleccionado:', selectedEvent);

        var cedula = selectedEvent.cedula;

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

        // Llamada AJAX para obtener la información del cliente usando la cedula que nos da dar click al evento del calendario
        $.ajax({
            // Este get lo que se trae es la info de un entrenador, faltan datos de cliente
            url: `${API_URL_BASE}/User/GetUsersValue?cedula=${cedula}`,
            method: 'GET',
            success: function (user) {
                const email = user.email.toString();
                console.log('Correo del usuario obtenido:', email);

                // Hacer la segunda solicitud AJAX con el email para obtener los campos de cliente
                $.ajax({
                    url: `${API_URL_BASE}/Cliente/GetClienteByEmail?email=${encodeURIComponent(email)}`,
                    method: 'GET',
                    success: function (cliente) {
                        const divDatosCliente = document.createElement('div');
                        divDatosCliente.innerHTML = `

                            <div class="text-center">
                            <h1 class="display-4">Información del cliente</h1>
                            <p id="instructions">Haga click en la cita de medición en el calendario para visualizar la información del cliente.</p>
                             </div>
                                <div class="row">
                                <div class="col-md-6 form-group">
                                    <label for="nombre">Nombre</label>
                                    <input type="text" class="form-control" id="nombre" required disabled />
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="apellido1">Apellido 1</label>
                                    <input type="text" class="form-control" id="apellido1" required disabled />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label for="apellido2">Apellido 2</label>
                                    <input type="text" class="form-control" id="apellido2" required disabled />
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="telefono">Teléfono</label>
                                    <input type="text" class="form-control" id="telefono" required disabled />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label for="email">Correo</label>
                                    <input type="text" class="form-control" id="email" required disabled />
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="fechaNacimiento">Fecha de Nacimiento</label>
                                    <input type="date" class="form-control" id="fechaNacimiento" required disabled />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label for="generoCliente">Género</label>
                                    <select class="form-control" id="generoCliente" required disabled>
                                        <option value="" disabled selected></option>
                                        <option value="femenino">Femenino</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="otro">Otro</option>
                                        <option value="nodecir">Prefiero no decir</option>
                                    </select>
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="cedula">Cedula</label>
                                    <input type="number" class="form-control" id="cedula" disabled />
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="col-md-6 d-flex flex-column align-items-center profile-container">
                                    <div class="form-group mb-3">
                                        <label for="fotoPerfilCliente">Foto de Perfil</label>
                                    </div>
                                    <img src="" id="imgFotoPerfil" class="img-fluid mt-2 profile-picture" />
                                </div>
                            </div>
                                <div class="form-container">
                                <form id="formDatosCita">
                                                                        <div class="text-center">
                            <h1 class="display-4">Calculo IMC/IGC</h1>
                            <p id="instructions">Por favor llene los siguientes datos:</p>
                             </div>
                                    <div class="row" id="medicionCliente">
                                        <div class="col-md-6 form-group">
                                            <label for="peso">Peso</label>
                                            <input type="number" class="form-control" id="peso" required placeholder ="Kg" step="1"/>
                                        </div>
                                        <div class="col-md-6 form-group">
                                            <label for="altura">Altura</label>
                                            <input type="number" class="form-control" id="altura" placeholder="Metros" required step="1" />
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-orange" id="sendBtn">Enviar</button>
                                </form>
                                <div id="resultadosMedicion">

                                </div>
                                </div>
                        `;

                        contenedorUsuario.appendChild(divDatosCliente);


                        console.log('Información del cliente obtenida:', cliente);
                        $("#nombre").val(cliente.nombre.toString());
                        $("#apellido1").val(cliente.apellido1.toString());
                        $("#apellido2").val(cliente.apellido2.toString());
                        $("#telefono").val(cliente.telefono.toString());
                        $("#email").val(cliente.email.toString());
                        $("#fechaNacimiento").val(formatDateString(cliente.fechaNacimiento));
                        $("#imgFotoPerfil").attr('src', cliente.fotoPerfilCliente.toString());
                        $("#cedula").val(cliente.cedula.toString());
                        $("#generoCliente").val(cliente.generoCliente.toString());
                        fechaNacimiento = cliente.fechaNacimiento;
                        cedulaCliente = cliente.cedula;
                        console.log("Fecha Nacimiento: " + fechaNacimiento);


                    },
                    error: function (err) {
                        console.error('Error al obtener la información del cliente:', err);
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un error al obtener la información del cliente.',
                            icon: 'error',
                            confirmButtonColor: '#ff8000'
                        });
                    }
                });
            },
            error: function (err) {
                console.error('Error al obtener el correo del usuario:', err);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al obtener el correo del usuario.',
                    icon: 'error',
                    confirmButtonColor: '#ff8000'
                });
            }
        });
    });
});


