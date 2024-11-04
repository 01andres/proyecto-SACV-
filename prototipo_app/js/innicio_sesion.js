import { URL_API } from "./config.js";

document.getElementById("form").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const warnings = document.getElementById("warnings");

  // Limpiar el contenido de warnings
  warnings.innerHTML = "";

  // Validar si los campos están vacíos
  if (!email || !password) {
    warnings.innerHTML = "Por favor, completa todos los campos.";
    return;
  }

  // Expresión regular para validar el correo
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
  if (!emailRegex.test(email)) {
    warnings.innerHTML = "Por favor, ingresa un correo válido.";
    return;
  }

  try {
    const response = await fetch(`${URL_API}/Loggin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mail: email, contrasenia: password }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.length > 0) {
        const usuario = data[0];
        localStorage.setItem("id", usuario.idDocumentoUsuario);

        if (usuario.idTipoUsuario == 2) {
          window.location.href = "/prototipo_app/html/selccion_servicios.html";
          
        } else {
          window.location.href = "/prototipo_app/html/listarCitas.html";
        }
      } else {
        warnings.innerHTML = "Usuario no encontrado. Verifica tus credenciales.";
      }
    } else {
      warnings.innerHTML = "Error al iniciar sesión. Intenta de nuevo más tarde.";
    }
  } catch (error) {
    warnings.innerHTML = "Error de conexión. Verifica tu red e intenta de nuevo.";
    console.error("Error:", error);
  }
});

// Mostrar/ocultar contraseña
document.getElementById("show-password").addEventListener("change", function () {
  const passwordField = document.getElementById("password");
  if (this.checked) {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
});
