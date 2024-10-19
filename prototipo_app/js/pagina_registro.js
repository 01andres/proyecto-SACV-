import { URL_API } from "./config.js";

const boton = document.getElementById("botonCreate");

document.addEventListener("DOMContentLoaded", (event) => {
  const btnCrear = document.getElementById("botonCreate");
//   event.preventDefault();



  btnCrear.addEventListener("click", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const apellido = document.getElementById("apellidos").value;
    const documento = document.getElementById("documento").value;
    const contacto = document.getElementById("contacto").value;
    const mail = document.getElementById("email").value;
    const contrasenia = document.getElementById("password").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;

    console.log(documento);
    
    const data = {
      idDocumentoUsuario: documento,
      nombreUsuario: name,
      apellido: apellido,
      contacto: contacto,
      mail: mail,
      contrasenia: contrasenia,
      fechaNacimiento: fechaNacimiento,
      idTipoUsuario: 2,
    };
    
    console.log(data);
    
    fetch(`${URL_API}/usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Datos enviados correctamente");
          window.location.href = "/prototipo_app/html/innicio_sesion.html";
          alert("usuario creado con exito");
          
        } else {
          console.error("Error al enviar la solicitud:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
      });
  });
});

