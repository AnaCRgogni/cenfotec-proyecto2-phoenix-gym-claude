$(document).ready(function () {
    const form = document.getElementById('createClase');

    let rolUsuario = 'Entrenador';

    function loadTrainers() {
        $.ajax({
            url: `${API_URL_BASE}/Entrenador/GetEntrenadores?rolUsuario=${rolUsuario}`,
            type: 'GET',
            success: function (data) {
                let trainerOptions = data.map(trainer => {
                    if (trainer.tipoEntrenador == "Entrenador de Piso" || trainer.tipoEntrenador == "Ambos") {
                        let nombreCompleto = `${trainer.nombre} ${trainer.apellido1} ${trainer.apellido2}`;
                        return `<option value="${trainer.id}" data-cedula="${trainer.cedula}">${nombreCompleto}</option>`;
                    }
                });
                $('#entrenador').html(trainerOptions.join(''));
            },
            error: function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error cargando entrenadores.',
                    confirmButtonColor: '#ff8000'
                });
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
        eventDisplayDefault: false,
        eventListToggler: false,
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

    async function checkClaseConflict(fechaClase, entrenador, cedula) {
        try {
            const inputDateLocal = new Date(fechaClase);
            const inputDateUTC = inputDateLocal.toISOString();
    
            console.log("Input FechaClase (UTC):", inputDateUTC);
    
            const response = await $.ajax({
                url: `${API_URL_BASE}/Clase/GetAllClases`,
                type: 'GET',
                dataType: 'json'
            });
    
            const conflictExists = response.some(clase => {

                let claseDateUTC = new Date(clase.fechaClase);
                claseDateUTC.setHours(claseDateUTC.getHours() - 6);
                const adjustedClaseDateUTC = claseDateUTC.toISOString();
                console.log("Clase FechaClase (UTC):", claseDateUTC);
                
                return adjustedClaseDateUTC === inputDateUTC && Number(clase.entrenador) === Number(entrenador);
            });
    
            const response2 = await $.ajax({
                url: `${API_URL_BASE}/HorarioEntrenadorPersonal/GetHorarioEntrenadorPersonal?cedula=${cedula}`,
                type: 'GET',
                dataType: 'json'
            });
    
            const conflictExists2 = response2.some(horario => {
                const [hourMinute, period] = horario.name.split(' ');
                let [hours, minutes] = hourMinute.split(':').map(Number);
    
                if (period.toLowerCase() === 'pm' && hours !== 12) {
                    hours += 12;
                }
                if (period.toLowerCase() === 'am' && hours === 12) {
                    hours = 0;
                }
    
                const horarioDateUTC = new Date(`${horario.date.split('T')[0]}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`).toISOString();
    
                console.log("Horario FechaClase (UTC):", horarioDateUTC);
    
                return horarioDateUTC === inputDateUTC;
            });
    
            console.log("Conflict Exists:", conflictExists || conflictExists2);
            return conflictExists || conflictExists2;
        } catch (error) {
            console.error('Error checking class conflict:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al verificar el conflicto de horarios. No se procederá con la creación de la clase.',
                confirmButtonColor: '#ff8000'
            });
            return false;
        }
    }
    

    document.getElementById('createClase').addEventListener('submit', async function (event) {
        event.preventDefault();

        const nombreClase = document.getElementById('nombreClase').value;
        const cupos = document.getElementById('cupos').value;

        let selectedOption = $('#entrenador').find('option:selected');
        let entrenador = selectedOption.val();
        let cedula = selectedOption.data('cedula');

        console.log(entrenador);
        console.log(cedula);

        let hourInput = $('#hour').val(); 
        let dateInput = $('#date').val(); 

function convertTo24Hour(dateStr, timeStr) {
    const [hourMinute, period] = timeStr.split(' ');
    let [hours, minutes] = hourMinute.split(':').map(Number);

    if (period.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    }
    if (period.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }

    const combinedDateTime = `${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`;
    
    const horarioDateUTC = new Date(combinedDateTime).toISOString();
    console.log("Horario FechaClase (UTC):", horarioDateUTC);

    return horarioDateUTC;
}

let fechaClaseFormatted = convertTo24Hour(dateInput, hourInput);

        console.log("ISO String:", fechaClaseFormatted);

        const data = {
            Id: 0,
            NombreClase: nombreClase,
            FechaClase: fechaClaseFormatted,
            Cupos: cupos,
            Entrenador: entrenador
        };

        console.log(JSON.stringify(data));

        const isConflict = await checkClaseConflict(fechaClaseFormatted, entrenador, cedula);

        if (isConflict) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El horario del entrenador no presenta disponibilidad para la hora elegida',
                confirmButtonColor: '#ff8000'
            });
        } else {
            $.ajax({
                url: `${API_URL_BASE}/Clase/CreateClase`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Clase agregada exitosamente.',
                        confirmButtonColor: '#ff8000'
                    });
                },
                error: function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error agregando la clase.',
                        confirmButtonColor: '#ff8000'
                    });
                }
            });
        }
    });
});
