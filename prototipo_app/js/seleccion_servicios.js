import { URL_API } from "./config.js";

var selectedOption ='';
var servicioSeleccionado = "";
let service = 0;

function seleccionarServicio(servicio) {
  servicioSeleccionado = servicio;

  if (servicioSeleccionado == "medicina Veterinaria") {
    service = 1;
  } else if (servicioSeleccionado == "peluqueria canina") {
    service = 2;
  } else if (servicioSeleccionado == "paseo canino") {
    service = 3;
  }
  console.log(service);
  alert("Has seleccionado el servicio: " + servicioSeleccionado);
}

window.seleccionarServicio = seleccionarServicio;

document.addEventListener("DOMContentLoaded", (event) => {
  const btnCrear = document.getElementById("ReservarCita");
  event.preventDefault();

  console.log('8-08-2024 3:47'.length);
  

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
    

    var formatofecha = `${fechaSeleccionada} ${selectedOption.text}`;

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
                alert("cita creada con exito");
              } else {
                console.error("Error al enviar la solicitud:", response.status);
              }
            })
            .catch((error) => {
              console.error("Error al enviar la solicitud:", error);
            });
        } else {
          alert("La hora seleccionada no esta disponible!");
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
      });
  });

  var select = document.getElementById('hora');
  select.addEventListener('change',
  function(){

  selectedOption = this.options[select.selectedIndex];
  
  console.log(selectedOption.value + ': ' + selectedOption.text);
  if( selectedOption.text == '02:00pm' ){
    selectedOption.text = '14:00'

  }else if(selectedOption.text == '03:00pm'){
    selectedOption.text = '15:00'

  }else if(selectedOption.text == '04:00pm'){
    selectedOption.text= '16:00'

  }else if(selectedOption.text == '05:00pm'){
    selectedOption.text = '17:00'
  }else {
    selectedOption.text = selectedOption.text.replace('am','')
  }

    console.log(selectedOption.value + ': ' + selectedOption.text);
  });

});

function mostrarMensaje() {
  if (servicioSeleccionado && fechaSeleccionada && horaSeleccionada) {
    // Mostrar el mensaje de confirmación
    document.getElementById("mensajeConfirmacion").style.display = "block";

    // Actualizar el contenido del mensaje con los datos seleccionados
    document.getElementById("servicioSeleccionado").innerText =
      servicioSeleccionado;
    document.getElementById("fechaSeleccionada").innerText = fechaSeleccionada;
    document.getElementById("horaSeleccionada").innerText = horaSeleccionada;
  } else {
    alert("Por favor, selecciona un servicio antes de reservar la cita.");
  }
}

window.mostrarMensaje = mostrarMensaje;
