import { URL_API } from "./config.js";

var search = document.getElementById("busqueda");
var tabla = document.getElementById("cuerpotabla");
var imprimirNum = document.getElementById("imprimirNum");
var pagSiguiente = 1;
var paginaFinal = 0;
var totalCount = 0;

function listarTabla(data) {
  tabla.innerHTML = ""; 
  data.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="text-center" >${user.idDocumentoUsuario} </td>
    <td class="text-center" >${user.nombreUsuario} </td>
    <td class="text-center" >${user.apellido} </td>
    <td class="text-center" >${user.contacto} </td>
    <td class="text-center" >${user.mail} </td>
    <td class="text-center" >${user.nombreServicio} </td>
    <td class="text-center" >${changeFormatDate(user.fechaServicio) } </td>
    <td> <button id="borrar" value =${user.idDetalleServicio} class="btn-danger" >eliminar</button></td>
    `;
    
    tabla.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let listarRegistros = 1;
  let tamañoMaximoRegistros = 7;
  
  function obtenerUsuarios(listarRegistros) {
    let inputSearch = event.target.value;
    if (inputSearch != undefined) {
      inputSearch = event.target.value;
    } else {
      inputSearch = '';
    }

    fetch(`${URL_API}/InnerJoin?search=${inputSearch}&offset=5&page=1` )
    .then((response) => response.json())
    .then((data) => {
      listarTabla(data);
      localStorage.removeItem("id");
      imprimirNum.innerText = pagSiguiente
    }).catch((error) => {
      console.error("Error al obtener datos de la API:", error)
    })
    }
  
    obtenerUsuarios(listarRegistros);

    search.addEventListener("input", (event) => {
      const busqueda = event.target.value;
      
      fetch(`${URL_API}/InnerJoin?search=${busqueda}&offset=5&page=1` )
      .then((response) => response.json())
      .then((data) => {
        listarTabla(data);
        localStorage.removeItem("id");
      })
      .catch((error) =>
        console.error("Error al obtener datos de la API:", error)
      );
    });

     const atrasTodo = document.getElementById("atrasTodo")
     const atrasUno = document.getElementById("atrasUno")
     const adelanteUno = document.getElementById("adelanteUno")
     const adelanteTodos = document.getElementById("adelanteTodos")

     atrasTodo.addEventListener('click', (event) => {
      
      fetch(`${URL_API}/InnerJoin?search=&offset=5&page=1` )
      .then((response) => response.json())
      .then((data) => {
        listarTabla(data);
        localStorage.removeItem("id");
        pagSiguiente = 1;
        imprimirNum.innerText = pagSiguiente;
        })
        .catch((error) =>
          console.error("Error al obtener datos de la API:", error)
        );
     });
    });

    adelanteUno.addEventListener('click', (event)=>{
      pagSiguiente = (pagSiguiente + 1)
      fetch(`${URL_API}/InnerJoin?search=&offset=5&page=${pagSiguiente}` )
      .then((response) => response.json())
      .then((data) => {
        listarTabla(data);

        localStorage.removeItem("id");
      })
      .catch((error) =>
        console.error("Error al obtener datos de la API:", error)
    );
    imprimirNum.innerText = pagSiguiente;
    })

    atrasUno.addEventListener('click', (event) => {
      if (pagSiguiente > 1) {
        pagSiguiente = (pagSiguiente - 1)
        fetch(`${URL_API}/InnerJoin?search=&offset=5&page=${pagSiguiente}` )
        .then((response) => response.json())
        .then((data) => {
          listarTabla(data);
          localStorage.removeItem("id");
          })
          .catch((error) =>
            console.error("Error al obtener datos de la API:", error)
          );
           imprimirNum.innerText = pagSiguiente
      }
    });

    function divirPagina(a) {
      paginaFinal = Math.ceil(a/5);
      pagSiguiente = paginaFinal
       
      return paginaFinal;
    }
    

    adelanteTodos.addEventListener('click', (event)=>{
      fetch(`${URL_API}/InnerJoin?search=&offset=5&page=1` )
      .then((response) => response.json())
      .then((data) => {
        totalCount = data[0].totalCount;
        console.log(typeof a);
        console.log(paginaFinal);

        
        fetch(`${URL_API}/InnerJoin?search=&offset=5&page=${divirPagina(data[0].totalCount)}` )
        .then((response) => response.json())
        .then((data) => {
          listarTabla(data);

          localStorage.removeItem("id");
          imprimirNum.innerText = pagSiguiente;  
          })
      }).catch((error) =>
        console.error("Error al obtener datos de la API:", error)
    );
    })

    tabla.addEventListener("click", (event) => {
      if (event.target.id == "borrar") {
        const confirmacion = confirm(
          "¿Estás seguro de que deseas eliminar este registro?"
        );
  
        if (confirmacion == true) {
          fetch(`${URL_API}/detalleServicio`, {
            method: "DELETE",
            body:JSON.stringify({idDetalleServicio: event.target.value}),
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

 function changeFormatDate (fecha) {
  const fechaTemp = fecha.split('T');
  const horaTemp = fechaTemp[1].split(':');
  const [hora, minutos] = horaTemp;
  let amPm = '';
  
  if(hora >= 12) {
    amPm = 'PM';
  } else {
    amPm = 'AM';
  }

  const [year, month, day] = fechaTemp[0].split('-');
  const fechaFormato = `${year}/${month}/${day} ${hora}:${minutos} ${amPm}`;

  return fechaFormato
}

