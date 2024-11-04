import { URL_API } from "./config.js";

var selectedOption = '';
var servicioSeleccionado = "";
let service = 0;

function seleccionarServicio(servicio) {
    servicioSeleccionado = servicio;

    if (servicioSeleccionado == "medicina Veterinaria") {
        service = 3;
    } else if (servicioSeleccionado == "peluqueria canina") {
        service = 1;
    } else if (servicioSeleccionado == "paseo canino") {
        service = 2;
    }
    console.log(service);
    alert("Has seleccionado el servicio: " + servicioSeleccionado);
}

window.seleccionarServicio = seleccionarServicio;

document.addEventListener("DOMContentLoaded", (event) => {
    const btnCrear = document.getElementById("ReservarCita");
    event.preventDefault();

    function desabilitarDias() {
        var fechaActual = new Date();
        var year = fechaActual.getFullYear();
        var dia = fechaActual.getDate();
        var mes = fechaActual.getMonth();
        mes = mes + 1;
        if (mes < 10) {
            var _mes = "0" + mes;
        } else {
            var _mes = mes.toString();
        }
        let fecha_minimo = year + "-" + _mes + "-" + dia;
        document.getElementById("fecha").setAttribute("min", fecha_minimo);
    }

    desabilitarDias();

    btnCrear.addEventListener("click", (event) => {
        event.preventDefault();

        var fechaSeleccionada = document.getElementById("fecha").value;
        var horaSeleccionada = selectedOption.text; // Asegúrate de capturar la hora seleccionada

        var formatofecha = `${fechaSeleccionada} ${horaSeleccionada}`;

        const consulta = {
            fechaServicio: formatofecha,
        };

        fetch(`${URL_API}/InnerJoin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(consulta),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                const data = {
                    fechaServicio: formatofecha,
                    idTipoServicio: service,
                    idDocumentoUsuario: localStorage.getItem("id"),
                };

                fetch(`${URL_API}/detalleServicio`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                .then((response) => {
                    if (response.ok) {
                        console.log("Datos enviados correctamente");
                        mostrarMensaje(); // Muestra el mensaje de confirmación aquí
                    } else {
                        console.error("Error al enviar la solicitud:", response.status);
                    }
                })
                .catch((error) => {
                    console.error("Error al enviar la solicitud:", error);
                });
            } else {
                alert("La hora seleccionada no está disponible!");
            }
        })
        .catch((error) => {
            console.error("Error al enviar la solicitud:", error);
        });
    });

    var select = document.getElementById('hora');
    select.addEventListener('change', function() {
        selectedOption = this.options[select.selectedIndex];
        
        console.log(selectedOption.value + ': ' + selectedOption.text);
        if (selectedOption.text == '02:00pm') {
            selectedOption.text = '14:00';
        } else if (selectedOption.text == '03:00pm') {
            selectedOption.text = '15:00';
        } else if (selectedOption.text == '04:00pm') {
            selectedOption.text = '16:00';
        } else if (selectedOption.text == '05:00pm') {
            selectedOption.text = '17:00';
        } else {
            selectedOption.text = selectedOption.text.replace('am', '');
        }

        console.log(selectedOption.value + ': ' + selectedOption.text);
    });
});

// Función para convertir de 24 horas a 12 horas
function convertirAHora12Horas(hora24) {
    let [horas, minutos] = hora24.split(':');
    horas = parseInt(horas, 10);
    minutos = minutos ? ':' + minutos : '';

    const periodo = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12; // Convierte 0 a 12

    return horas + minutos + ' ' + periodo;
}

// Función para formatear la fecha en día/mes/año
function formatearFecha(fecha) {
    const partes = fecha.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Retorna en formato día/mes/año
}

// Función para mostrar el mensaje de confirmación
function mostrarMensaje() {
    var fecha = document.getElementById("fecha").value;
    var hora = selectedOption.text; // La hora en formato 24 horas

    // Convertir la hora a formato de 12 horas
    var hora12 = convertirAHora12Horas(hora);
    // Formatear la fecha a día/mes/año
    var fechaFormateada = formatearFecha(fecha);

    if (servicioSeleccionado && fechaFormateada && hora12) {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("mensajeConfirmacion").style.display = "block";

        document.getElementById("fechaSeleccionada").innerText = fechaFormateada; // Mostrar fecha en formato día/mes/año
        document.getElementById("horaSeleccionada").innerText = hora12; // Mostrar hora en formato 12 horas
        document.getElementById("servicioSeleccionado").innerText = servicioSeleccionado;
    } else {
        alert("Por favor, selecciona un servicio antes de reservar la cita.");
    }
}

window.mostrarMensaje = mostrarMensaje;
