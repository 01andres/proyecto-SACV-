import { URL_API } from "./config.js";

var tabla = document.getElementById("cuerpotabla");
var inputBusqueda = document.getElementById("busqueda");
var pagUsuario = document.getElementById('pagUsuario')
var pagSiguiente = 1;
var paginaFinal = 0; 
var totalCount = 0;

function listarTablaU(data) {
  
  tabla.innerHTML = ""; 
  data.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="text-center" >${user.idDocumentoUsuario} </td>
    <td class="text-center" >${user.nombreUsuario} </td>
    <td class="text-center" >${user.apellido} </td>
    <td class="text-center" >${user.contacto} </td>
    <td class="text-center" >${user.mail} </td>
    <td class="text-center" >${changeFormatDate(user.fechaNacimiento) } </td>
    <td> <button id="editar" value =${user.idDocumentoUsuario} class="btn-warning" >editar</button></td>
    <td> <button id="borrar" value =${user.idDocumentoUsuario} class="btn-danger" >eliminar</button></td>
    `;
    
    tabla.appendChild(row);
    
  });
  
}


document.addEventListener("DOMContentLoaded", () => {
  let listarRegistros = 1; 
    function obtenerUsuarios(listarRegistros) {
      fetch(`${URL_API}/Usuario?busqueda=&offset=5&page=1` )
      .then((response) => response.json())
      .then((data) => {
        
        tabla.innerHTML = ""; 
        data.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td class="text-center" >${user.idDocumentoUsuario} </td>
          <td class="text-center" >${user.nombreUsuario} </td>
          <td class="text-center" >${user.apellido} </td>
          <td class="text-center" >${user.contacto} </td>
          <td class="text-center" >${user.mail} </td>
          <td class="text-center" >${changeFormatDate(user.fechaNacimiento) } </td>
          <td> <button id="editar" value =${user.idDocumentoUsuario} class="btn-warning" >editar</button></td>
          <td> <button id="borrar" value =${user.idDocumentoUsuario} class="btn-danger" >eliminar</button></td>
          `;
          
          tabla.appendChild(row);
          pagSiguiente = 1; 
          pagUsuario.innerText = pagSiguiente

        });

        localStorage.removeItem("id");
         })
         .catch((error) =>
           console.error("Error al obtener datos de la API:", error)
         );
     }
  
    obtenerUsuarios(listarRegistros);

    tabla.addEventListener("click", (event) => {
      if (event.target.id == "borrar") {
        const confirmacion = confirm(
          "¿Estás seguro de que deseas eliminar este registro?"
        );
  
        if (confirmacion == true) {
          fetch(`${URL_API}/usuario`, {
            method: "DELETE",
            body:JSON.stringify({idDocumentoUsuario: event.target.value}),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al eliminar el usuario");
              }
  
              event.target.closest("tr").remove();
            })
            .catch((error) => console.error("imposible eliminar usuario:", error));
        }
      } else if (event.target.id == "editar") {
        const id = event.target.closest("button.btn-warning").value; 
        localStorage.setItem('id', id);
        window.location.href = "/prototipo_app/html/editarUsuario.html"  // Agrega el parámetro a la URL
      }
      
      
    });

    inputBusqueda.addEventListener("input", (event) => {
      const busqueda = event.target.value;
      console.log(busqueda);
      
      fetch(`${URL_API}/Usuario?busqueda=${busqueda}&offset=5&page=1` )
      .then((response) => response.json())
      .then((data) => {
        
        tabla.innerHTML = ""; 
        data.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td class="text-center" >${user.idDocumentoUsuario} </td>
          <td class="text-center" >${user.nombreUsuario} </td>
          <td class="text-center" >${user.apellido} </td>
          <td class="text-center" >${user.contacto} </td>
          <td class="text-center" >${user.mail} </td>
          <td class="text-center" >${changeFormatDate(user.fechaNacimiento) } </td>
          <td> <button id="editar" value =${user.idDocumentoUsuario} class="btn-warning" >editar</button></td>
          <td> <button id="borrar" value =${user.idDocumentoUsuario} class="btn-danger" >eliminar</button></td>
          `;
          
          tabla.appendChild(row);
          
        });

         })
         .catch((error) =>
           console.error("Error al obtener datos de la API:", error)
         );
    });
      const anteriorTodo = document.getElementById('anteriorTodo')
      const anteriorUno = document.getElementById('anteriorUno')
      const siguienteUno = document.getElementById('siguienteUno')
      const siguienteTodo = document.getElementById('siguienteTodo')

      anteriorTodo.addEventListener('click',(event) => {

        fetch(`${URL_API}/Usuario?busqueda=&offset=5&page=1` )
        .then((response) => response.json())
        .then((data) => {
          

          listarTablaU(data);
          console.log('si entro');
          pagUsuario.innerText = pagSiguiente
          localStorage.removeItem("id")
           })
           .catch((error) =>
             console.error("Error al obtener datos de la API:", error)
           );
           pagSiguiente = 1; 
           
    });

    siguienteUno.addEventListener('click', (event)=> {
      pagSiguiente = ( pagSiguiente  + 1 )
      fetch(`${URL_API}/Usuario?busqueda=&offset=5&page=${pagSiguiente}` )
      .then((response) => response.json())
      .then((data) => {
        listarTablaU(data);

        localStorage.removeItem("id")
         })
         .catch((error) =>
           console.error("Error al obtener datos de la API:", error)
         );
         pagUsuario.innerText = pagSiguiente
         console.log('si entro al numero ' + pagSiguiente);
    });


    anteriorUno.addEventListener('click', (event)=> {
      pagSiguiente = ( pagSiguiente  - 1 )
      fetch(`${URL_API}/Usuario?busqueda=&offset=5&page=${pagSiguiente}` )
      .then((response) => response.json())
      .then((data) => {
        listarTablaU(data);
        localStorage.removeItem("id")
         })
         .catch((error) =>
           console.error("Error al obtener datos de la API:", error)
         );
         pagUsuario.innerText = pagSiguiente
         console.log('retroceder uno ' + pagSiguiente);
    });

    function dividirPagina(a) {
      paginaFinal = Math.ceil(a/5);
      pagSiguiente = paginaFinal
       
      return paginaFinal;
    }

    siguienteTodo.addEventListener('click', (event)=>{
      fetch(`${URL_API}/Usuario?busqueda=&offset=5&page=1` )
      .then((response) => response.json())
      .then((data) => {
        totalCount = data[0].totalCount;
        console.log(paginaFinal);
        console.log(typeof a);
        
        
        fetch(`${URL_API}/Usuario?busqueda=&offset=5&page=${dividirPagina(data[0].totalCount)}` )
        .then((response) => response.json())
        .then((data) => {
          listarTablaU(data);

          localStorage.removeItem("id");
          pagUsuario.innerText = paginaFinal;  
          console.log('si funciono');
          
          })
      }).catch((error) =>
        console.error("Error al obtener datos de la API:", error)
    );
    })





















  });

 function changeFormatDate (fecha) {
  const fechaTemp = fecha.split('T');
  const [year, month, day] = fechaTemp[0].split('-');
  const fechaFormato = `${year}/${month}/${day}`;
  return fechaFormato
}