const d = document;
let busquedaInput = d.querySelector("#busquedaInput");
let nombreInput = d.querySelector("#nombreInput");
let precioInput = d.querySelector("#precioInput");
let imagenInput = d.querySelector("#imagenInput");
let descripcionInput = d.querySelector("#descripcionInput");
let btnGuardar = d.querySelector("#btnGuardar");
let btnExportar = d.querySelector("#btnExportar");
let tabla = d.querySelector(".table > tbody");

// Cargar datos al iniciar
window.addEventListener("DOMContentLoaded", () => {
    busquedaInput.addEventListener("input", filtrar);
    mostrarDatos();
});

btnGuardar.addEventListener("click", () => {
    let datos = validarFormulario();
    if (datos) {
        guardarData(datos);
        mostrarDatos();
    }
});

function validarFormulario() {
    if (nombreInput.value && precioInput.value && descripcionInput.value && imagenInput.value) {
        let datosForm = {
            nombre: nombreInput.value,
            precio: precioInput.value,
            imagen: imagenInput.value,
            descripcion: descripcionInput.value
        };
        limpiarFormulario();
        return datosForm;
    } else {
        alert("Todos los campos son obligatorios");
        return null;
    }
}

function limpiarFormulario() {
    nombreInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    descripcionInput.value = "";
}

function guardarData(datos) {
    let productos = JSON.parse(localStorage.getItem("ListadoProductos")) || [];
    productos.push(datos);
    localStorage.setItem("ListadoProductos", JSON.stringify(productos));
    alert("Producto guardado con éxito");
}

function mostrarDatos() {
    tabla.innerHTML = "";
    let productos = JSON.parse(localStorage.getItem("ListadoProductos")) || [];
    productos.forEach((producto, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td><img src="${producto.imagen}" width="50px"></td>
            <td>
               <button onclick="editarProducto(${i})" class="btn btn-warning">✏</button>
               <button onclick="eliminarProducto(${i})" class="btn btn-danger">❌</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("ListadoProductos")) || [];
    productos.splice(index, 1);
    localStorage.setItem("ListadoProductos", JSON.stringify(productos));
    mostrarDatos();
}

function editarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("ListadoProductos")) || [];
    let producto = productos[index];
    
    nombreInput.value = producto.nombre;
    precioInput.value = producto.precio;
    imagenInput.value = producto.imagen;
    descripcionInput.value = producto.descripcion;
    
    productos.splice(index, 1);
    localStorage.setItem("ListadoProductos", JSON.stringify(productos));
    mostrarDatos();
}

function filtrar() {
    let filtro = busquedaInput.value.toLowerCase();
    let productos = JSON.parse(localStorage.getItem("ListadoProductos")) || [];
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(filtro));
    mostrarFiltrados(productosFiltrados);
}

function mostrarFiltrados(productos) {
    tabla.innerHTML = "";
    productos.forEach((producto, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td><img src="${producto.imagen}" width="50px"></td>
            <td>
               <button onclick="editarProducto(${i})" class="btn btn-warning">✏</button>
               <button onclick="eliminarProducto(${i})" class="btn btn-danger">❌</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

btnExportar.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let productos = JSON.parse(localStorage.getItem("ListadoProductos")) || [];
    let y = 10;
    doc.text("Lista de Productos", 10, y);
    y += 10;
    productos.forEach((producto, i) => {
        doc.text(`${i + 1}. ${producto.nombre} - ${producto.precio} - ${producto.descripcion}`, 10, y);
        y += 10;
    });
    doc.save("productos.pdf");
});