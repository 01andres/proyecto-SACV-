import { URL_API } from "./config.js";

const boton =  document.getElementById("boton_login");
boton.addEventListener("click", (event) => {});
document.addEventListener("DOMContentLoaded", (event) => {
  const btnEditar = document.getElementById("boton_login");
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const id = localStorage.getItem('id');

  const name = document.getElementById("name");
  const apellido = document.getElementById("apellidos");
  const contacto = document.getElementById("contacto");
  const mail = document.getElementById("email");
  const contrasenia = document.getElementById("password");
  const fechaNacimiento = document.getElementById("fechaNacimiento");

  fetch(`${URL_API}/usuario?busqueda=${id}&offset=10&page=1`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((user) => {
        name.value = user.nombreUsuario;
        apellido.value = user.apellido;
        contacto.value = user.contacto;
        mail.value = user.mail;
        contrasenia.value = user.contrasenia;
        fechaNacimiento.value = user.fechaNacimiento.split('T')[0];
      });
      
    })
    .catch((error) =>
      console.error("Error al obtener datos de la API:", error)
    );

  btnEditar.addEventListener("click", (event) => {
    event.preventDefault();
    const data = {
        idDocumentoUsuario: id,
        nombreUsuario: name.value,
        apellido: apellido.value,
        contacto: contacto.value,
        mail: mail.value,
        contrasenia: contrasenia.value,
        fechaNacimiento: fechaNacimiento.value,
        idTipoUsuario: 2
    };

    console.log(data);

    fetch(`${URL_API}/usuario`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
            localStorage.removeItem("id");
          console.log("Datos enviados correctamente");
          event.preventDefault();
          window.location.href = "/prototipo_app/html/index_admin.html";
        } else {
          console.error("Error al enviar la solicitud:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
      });
  });
});
