const cedula = sessionStorage.getItem("cedula");
const email = sessionStorage.getItem("correo");
function createProgressChart(imcName, imcData,igcName,igcData,pesoName,pesoData,mesesChart) {
    return {
        series: [
            {
                name: imcName,
                data: imcData

            },
            {
                name: igcName,
                data: igcData

            },
            {
                name: pesoName,
                data: pesoData

            }

        ],
        chart: {
            height: 350,
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        noData: {
            text: undefined,
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
                color: undefined,
                fontSize: '14px',
                fontFamily: undefined
            }
        },
        colors: ['#e67300', "#ffcc00","#000000"],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Progreso',
            align: 'center'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            categories: mesesChart,
        },
        yaxis: {
            min: 10,
            max: 100
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
        }

    }

}

var nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var mesesChart = [];

function obtenerNombresMesesUnicos(data) {
    var nombresMesesUnicos = []; //Almacena nombres meses

    //Por cada objeto dentro de data
    data.forEach(function (item) {
        var fecha = new Date(item.fecha); //Agarramos fecha de cada objeto
        var mes = fecha.getMonth(); //Conseguimos el es de cada fecha en numero

        var nombreMes = nombresMeses[mes]; //Pasamos el numero a la lista de nombre meses y dependiendo del numero es la posicion de lista
        if (!nombresMesesUnicos.includes(nombreMes)) {//si la lista no tiene el nombre entonces lo meto en la lista
            nombresMesesUnicos.push(nombreMes); 
        }
    });

    // Devuelvo lista de nombres
    return nombresMesesUnicos;
}

document.addEventListener('DOMContentLoaded', function () {
    const cedula = sessionStorage.getItem("cedula");
    const email = sessionStorage.getItem("email");

    $.ajax({
        url: `${API_URL_BASE}/Medicion/GetMedicionByCliente?cedula=${cedula}`,
        type: 'GET',
        success: function (data) {
            //console.log(JSON.stringify(data));
            var meses = obtenerNombresMesesUnicos(data);

            var imcResultados = [];
            var igcResultados = [];
            var pesoResultado = [];

            data.forEach(function (medicion) {
                var peso = medicion.peso;
                var imc = medicion.imc
                var igc = medicion.igc

                imcResultados.push(imc);  
                igcResultados.push(igc);
                pesoResultado.push(peso);

            });

            console.log("IMC Resultados:", imcResultados);
            console.log("IGC Resultados:", igcResultados);
            console.log("Peso Resultado: ", pesoResultado);

            var imcTitle = "% IMC";
            var igcTitle = "% IGC";
            var pesoTitle = "Peso (KG)";


            var dataChart = createProgressChart(imcTitle, imcResultados, igcTitle, igcResultados, pesoTitle, pesoResultado,meses);
            var progressChart = new ApexCharts(document.querySelector("#charts"), dataChart);
            progressChart.render();
        },
        error: function (error) {
            console.error("Error al obtener los datos:", error);
        }
    });
});



 

