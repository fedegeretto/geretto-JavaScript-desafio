// Obteniendo los botones de Comprar ahora
const botones_comprar = document.querySelectorAll(".button");

// Obteniendo el tbody del carrito
const tbody = document.querySelector(".tbody")

// Creación de carrito vacío
let carrito = [];

// Recorriendo los botones, capturar el evento "click" y ejecutar función
botones_comprar.forEach(btn => {
    btn.addEventListener("click", agregar_producto_carrito);
})

// Creando la función agregar_producto_carrito
function agregar_producto_carrito(e){
    const boton = e.target;
    // Buscando el contenedor del botón
    const padreBoton = boton.parentNode.parentNode.parentNode;
    // Seleccionando cada parte del producto
    const producto_nombre = padreBoton.querySelector(".card-title").textContent;
    const producto_precio = padreBoton.querySelector(".precio").textContent;
    const producto_imagen = padreBoton.querySelector(".card-img-top").src;
    
    // Creando el producto con los datos obtenidos
    const nuevo_producto = {
        title: producto_nombre,
        precio: producto_precio,
        img: producto_imagen,
        cantidad: 1
    }

    alerta_agregar()

    // Llamado a la función agregar carrito con el producto
    agregarAlCarrito(nuevo_producto);
}

// Creación de la funcion agregarAlCarrito para pushear el producto y llamar a una función para Optimizar el Carrito
function agregarAlCarrito(nuevo_producto){
    
    const InputElemento = tbody.getElementsByClassName("input__elemento")
    // Sumarle a cantidad cuando se repite el titulo del nuevo producto
    for(let i = 0; i < carrito.length; i++){
        if(carrito[i].title.trim() === nuevo_producto.title.trim()){
            carrito[i].cantidad ++;
            const inputValue = InputElemento[i]
            inputValue.value++
            sumatoria_carrito()
            return null
        }
    }

    carrito.push(nuevo_producto);
    optimizar_carrito();
}

// Creación de la funcion para Optimizar el Carrito
function optimizar_carrito(){
    tbody.innerHTML = "";
    carrito.map(producto => {
        const tr = document.createElement("tr");
        tr.classList.add("productoCarrito");
        const Contenido = 
        `<th scope="row">1</th>
            <td class="table__productos">
                <img src=${producto.img} alt="">
                <h6 class="title">${producto.title}</h6>
            </td>
            <td class="table__precio">
                <p>${producto.precio}</p>
            </td>
            <td class="table__cantidad">
                <input type="number" min="1" value=${producto.cantidad} class="input__elemento">
                <button class="delete btn btn-danger">X</button>
            </td>`

        tr.innerHTML = Contenido;
        tbody.append(tr)

        tr.querySelector(".delete").addEventListener("click", eliminar_producto_carrito);
        tr.querySelector(".input__elemento").addEventListener("change", suma_la_cantidad);
    })

    sumatoria_carrito()

}


// Función para sumar el total del carrito
function sumatoria_carrito(){
    let total = 0;
    const carritoTotal = document.querySelector(".carritoTotal");
    carrito.forEach((producto) => {
    const precio = Number(producto.precio.replace("$", ""))
    total = total + precio * producto.cantidad
    })
    carritoTotal.innerHTML = `Total $${total}`

    guardarLocalStorage()
}

// Función para eliminar el producto del carrito con el botón
function eliminar_producto_carrito(e){
    const boton_eliminar = e.target;
    const tr = boton_eliminar.parentNode.parentNode;
    const title = tr.querySelector(".title").textContent;
    for(let i = 0; i < carrito.length; i++){
        if(carrito[i].title.trim() === title.trim()){
            carrito.splice(i, 1)
        }
    }
    tr.remove();
    sumatoria_carrito();
    alerta_eliminar()
}


// Función para cambiar la cantidad de cada producto al cambiar el numero del input
function suma_la_cantidad(e){
    const suma_input = e.target;
    const tr = suma_input.parentNode.parentNode;
    const title = tr.querySelector(".title").textContent;
    carrito.forEach(producto => {
        if(producto.title.trim() === title.trim()){
            suma_input.value < 1 ? (suma_input.value = 1) : suma_input.value;
            producto.cantidad = suma_input.value;
        }
        sumatoria_carrito();
    })
}

// Script para no perder los productos del carrito al actualizar con localstorage

function guardarLocalStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito));

}

window.onload = function(){
    let storage = JSON.parse(localStorage.getItem("carrito"))
    if(storage){
        carrito = storage;
        optimizar_carrito();
    }
}


// Alerta de agregar al carrito

function alerta_agregar(){
    Swal.fire({
        title: "Producto añadido al carrito exitosamente",
        width: "100%",
        timer: 2000,
        timerProgressBar: true,
        position: "top",
        showConfirmButton: false,
        color: "#000000",
    })
}

// Alerta 
function alerta_compra(){
    Swal.fire({
        icon: "success",
        title: "¡Muchas gracias por realizar su compra!",
        width: "50%",
        timer: 2000,
        timerProgressBar: true,
        position: "center",
        color: "#000000",
    })
}

let boton_compra = document.getElementById("boton-comprar")


boton_compra.addEventListener("click", alerta_compra)

function alerta_eliminar(){
    Swal.fire({
        icon: "error",
        title: "¡Producto eliminado del carrito!",
        width: "50%",
        position: "center",
        color: "#000000",
        confirmButtonColor: "#001032"
    })
}

