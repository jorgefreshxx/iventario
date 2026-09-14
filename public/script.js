// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const formProducto = document.getElementById("formProducto");
const tablaProductos = document.getElementById("tablaProductos");
const buscar = document.getElementById("buscar");

const categoria = document.getElementById("categoria");
const proveedor = document.getElementById("proveedor");

const totalProductos = document.getElementById("totalProductos");
const totalUnidades = document.getElementById("totalUnidades");
const stockBajo = document.getElementById("stockBajo");
const valorInventario = document.getElementById("valorInventario");
const tablaVentas =document.getElementById("tablaVentas");
const detalleVentaSection =document.getElementById("detalleVentaSection");
const tablaDetalleVenta =document.getElementById("tablaDetalleVenta");
const tituloDetalleVenta =document.getElementById("tituloDetalleVenta");
const informacionVenta =document.getElementById("informacionVenta");

// Elementos de ventas
const formVenta = document.getElementById("formVenta");
const clienteVenta = document.getElementById("clienteVenta");
const productoVenta = document.getElementById("productoVenta");
const cantidadVenta = document.getElementById("cantidadVenta");
const btnAgregarVenta = document.getElementById("btnAgregarVenta");
const tablaVenta = document.getElementById("tablaVenta");
const totalVenta = document.getElementById("totalVenta");
const btnRegistrarVenta = document.getElementById("btnRegistrarVenta");
const formCliente =document.getElementById("formCliente");
const tablaClientes =document.getElementById("tablaClientes");
const nombreCliente =document.getElementById("nombreCliente");
const telefonoCliente =document.getElementById("telefonoCliente");
const correoCliente =document.getElementById("correoCliente");
const formCategoria = document.getElementById("formCategoria");
const tablaCategorias = document.getElementById("tablaCategorias");
const nombreCategoria =document.getElementById("nombreCategoria");
const descripcionCategoria =document.getElementById("descripcionCategoria");

// ==========================================
// VARIABLES
// ==========================================

let productos = [];
let clientes = [];
let carritoVenta = [];


// ==========================================
// CARGAR CATEGORÍAS
// ==========================================

async function cargarCategorias() {

    try {

        const respuesta = await fetch("/categorias");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron cargar las categorías"
            );
        }

        const categorias = await respuesta.json();

        // Llenar el selector de productos
        categoria.innerHTML = `
            <option value="">
                Seleccionar categoría
            </option>
        `;

        categorias.forEach(item => {

            const opcion = document.createElement("option");

            opcion.value = item.id_categoria;
            opcion.textContent = item.nombre;

            categoria.appendChild(opcion);

        });

        // Mostrar tabla de categorías
        mostrarCategorias(categorias);

    } catch (error) {

        console.error(
            "Error al cargar categorías:",
            error
        );

    }

}
// ==========================================
// MOSTRAR CATEGORÍAS
// ==========================================

function mostrarCategorias(categorias) {

    tablaCategorias.innerHTML = "";

    if (categorias.length === 0) {

        tablaCategorias.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No hay categorías registradas
                </td>
            </tr>
        `;

        return;

    }

    categorias.forEach(item => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                ${item.id_categoria}
            </td>

            <td>
                ${item.nombre}
            </td>

            <td>
                ${item.descripcion || "-"}
            </td>

            <td>

                <button
                    class="btn-editar"
                    onclick="editarCategoria(${item.id_categoria})">
                    Editar
                </button>

                <button
                    class="btn-eliminar"
                    onclick="eliminarCategoria(${item.id_categoria})">
                    Eliminar
                </button>

            </td>
        `;

        tablaCategorias.appendChild(fila);

    });

}
// ==========================================
// GUARDAR / ACTUALIZAR CATEGORÍA
// ==========================================

formCategoria.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const nombre =
            nombreCategoria.value.trim();

        const descripcion =
            descripcionCategoria.value.trim();

        if (!nombre) {

            alert(
                "El nombre de la categoría es obligatorio."
            );

            return;

        }

        const datos = {
            nombre,
            descripcion
        };

        try {

            const idEditando =
                formCategoria.dataset.editando;

            let respuesta;

            if (idEditando) {

                respuesta = await fetch(
                    `/categorias/${idEditando}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(datos)
                    }
                );

            } else {

                respuesta = await fetch(
                    "/categorias",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(datos)
                    }
                );

            }

            const resultado =
                await respuesta.json();

            if (!respuesta.ok) {

                alert(
                    resultado.error ||
                    "No se pudo guardar la categoría."
                );

                return;

            }

            alert(
                idEditando
                    ? "Categoría actualizada correctamente."
                    : "Categoría registrada correctamente."
            );

            formCategoria.reset();

            delete formCategoria.dataset.editando;

            await cargarCategorias();

        } catch (error) {

            console.error(
                "Error al guardar categoría:",
                error
            );

            alert(
                "No se pudo conectar con el servidor."
            );

        }

    }
);
// ==========================================
// EDITAR CATEGORÍA
// ==========================================

async function editarCategoria(id) {

    try {

        const respuesta =
            await fetch("/categorias");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las categorías"
            );

        }

        const categorias =
            await respuesta.json();

        const categoriaEncontrada =
            categorias.find(
                item =>
                    Number(item.id_categoria) ===
                    Number(id)
            );

        if (!categoriaEncontrada) {

            alert(
                "Categoría no encontrada."
            );

            return;

        }

        nombreCategoria.value =
            categoriaEncontrada.nombre;

        descripcionCategoria.value =
            categoriaEncontrada.descripcion || "";

        formCategoria.dataset.editando =
            id;

        formCategoria.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        console.error(
            "Error al editar categoría:",
            error
        );

        alert(
            "No se pudo cargar la categoría."
        );

    }

}
// ==========================================
// ELIMINAR CATEGORÍA
// ==========================================

async function eliminarCategoria(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar esta categoría?"
        );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta =
            await fetch(
                `/categorias/${id}`,
                {
                    method: "DELETE"
                }
            );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.error ||
                "No se pudo eliminar la categoría."
            );

            return;

        }

        alert(
            "Categoría eliminada correctamente."
        );

        await cargarCategorias();

    } catch (error) {

        console.error(
            "Error al eliminar categoría:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}

// ==========================================
// CARGAR PROVEEDORES DESDE MYSQL
// ==========================================

async function cargarProveedores() {

    try {

        const respuesta = await fetch("/proveedores");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los proveedores");
        }

        const proveedores = await respuesta.json();

        proveedor.innerHTML = `
            <option value="">
                Seleccionar proveedor
            </option>
        `;

        proveedores.forEach(p => {

            const opcion = document.createElement("option");

            opcion.value = p.id_proveedor;
            opcion.textContent = p.nombre;

            proveedor.appendChild(opcion);

        });

    } catch (error) {

        console.error("Error al cargar proveedores:", error);

    }

}


// ==========================================
// CARGAR CLIENTES DESDE MYSQL
// ==========================================

async function cargarClientes() {

    try {

        const respuesta = await fetch("/clientes");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los clientes");
        }

        clientes = await respuesta.json();

        clienteVenta.innerHTML = `
            <option value="">
                Seleccionar cliente
            </option>
        `;

        clientes.forEach(cliente => {

            const opcion = document.createElement("option");

            opcion.value = cliente.id_cliente;
            opcion.textContent =
                `${cliente.nombre} - ${cliente.telefono || "Sin teléfono"}`;

            clienteVenta.appendChild(opcion);

        });

    } catch (error) {

        console.error("Error al cargar clientes:", error);

        clienteVenta.innerHTML = `
            <option value="">
                No se pudieron cargar los clientes
            </option>
        `;

    }

}


// ==========================================
// CARGAR PRODUCTOS PARA LA VENTA
// ==========================================

function cargarProductosEnVenta() {

    productoVenta.innerHTML = `
        <option value="">
            Seleccionar producto
        </option>
    `;

    productos.forEach(producto => {

        const opcion = document.createElement("option");

        opcion.value = producto.id_producto;

        opcion.textContent =
            `${producto.nombre} - Stock: ${producto.stock}`;

        productoVenta.appendChild(opcion);

    });

}


// ==========================================
// CARGAR PRODUCTOS DESDE MYSQL
// ==========================================

async function cargarProductos() {

    try {

        const respuesta = await fetch("/productos");

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los productos");
        }

        productos = await respuesta.json();

        mostrarProductos(productos);

        cargarProductosEnVenta();

    } catch (error) {

        console.error("Error:", error);

        tablaProductos.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    No se pudieron cargar los productos
                </td>
            </tr>
        `;

    }

}


// ==========================================
// MOSTRAR PRODUCTOS EN INVENTARIO
// ==========================================

function mostrarProductos(lista) {

    tablaProductos.innerHTML = "";

    if (lista.length === 0) {

        tablaProductos.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    No hay productos registrados
                </td>
            </tr>
        `;

        actualizarResumen(lista);

        return;
    }


    lista.forEach(producto => {

        const estadoStock =
            Number(producto.stock) <= Number(producto.stock_minimo)
                ? "stock-bajo"
                : "stock-normal";


        const fila = document.createElement("tr");


        fila.innerHTML = `

            <td>${producto.codigo}</td>

            <td>${producto.nombre}</td>

            <td>${producto.categoria}</td>

            <td>${formatoMoneda(producto.precio_compra)}</td>

            <td>${formatoMoneda(producto.precio_venta)}</td>

            <td class="${estadoStock}">
                ${producto.stock}
            </td>

            <td>${producto.stock_minimo}</td>

            <td>${producto.proveedor}</td>

            <td>

                <button
                    class="btn-editar"
                    onclick="editarProducto(${producto.id_producto})">
                    Editar
                </button>

                <button
                    class="btn-eliminar"
                    onclick="eliminarProducto(${producto.id_producto})">
                    Eliminar
                </button>

            </td>
        `;

        tablaProductos.appendChild(fila);

    });

    actualizarResumen(lista);

}


// ==========================================
// AGREGAR O ACTUALIZAR PRODUCTO
// ==========================================

formProducto.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const codigo =
            document.getElementById("codigo").value.trim();

        const nombre =
            document.getElementById("nombre").value.trim();

        const id_categoria =
            Number(categoria.value);

        const id_proveedor =
            Number(proveedor.value);

        const precio_compra =
            Number(
                document.getElementById("precioCompra").value
            );

        const precio_venta =
            Number(
                document.getElementById("precioVenta").value
            );

        const stock =
            Number(
                document.getElementById("stock").value
            );

        const stock_minimo =
            Number(
                document.getElementById("stockMinimo").value
            );


        if (!id_categoria) {

            alert("Selecciona una categoría.");

            return;

        }


        if (!id_proveedor) {

            alert("Selecciona un proveedor.");

            return;

        }


        const producto = {

            codigo,
            nombre,
            id_categoria,
            id_proveedor,
            precio_compra,
            precio_venta,
            stock,
            stock_minimo

        };


        try {

            const idEditando =
                formProducto.dataset.editando;

            let respuesta;


            // ACTUALIZAR

            if (idEditando) {

                respuesta = await fetch(
                    `/productos/${idEditando}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(producto)

                    }
                );

            }


            // AGREGAR

            else {

                respuesta = await fetch(
                    "/productos",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(producto)

                    }
                );

            }


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                alert(
                    resultado.error ||
                    "No se pudo guardar el producto"
                );

                return;

            }


            if (idEditando) {

                alert(
                    "Producto actualizado correctamente."
                );

                delete formProducto.dataset.editando;

            }

            else {

                alert(
                    "Producto guardado correctamente en MySQL."
                );

            }


            formProducto.reset();

            await cargarProductos();

        } catch (error) {

            console.error("Error:", error);

            alert(
                "No se pudo conectar con el servidor."
            );

        }

    }
);


// ==========================================
// EDITAR PRODUCTO
// ==========================================

async function editarProducto(id) {

    try {

        const respuesta =
            await fetch("/productos");

        const lista =
            await respuesta.json();

        const producto =
            lista.find(
                p =>
                    Number(p.id_producto) ===
                    Number(id)
            );


        if (!producto) {

            alert("Producto no encontrado.");

            return;

        }


        document.getElementById("codigo").value =
            producto.codigo;

        document.getElementById("nombre").value =
            producto.nombre;

        categoria.value =
            producto.id_categoria;

        document.getElementById("precioCompra").value =
            producto.precio_compra;

        document.getElementById("precioVenta").value =
            producto.precio_venta;

        document.getElementById("stock").value =
            producto.stock;

        document.getElementById("stockMinimo").value =
            producto.stock_minimo;

        proveedor.value =
            producto.id_proveedor;


        formProducto.dataset.editando = id;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error("Error:", error);

        alert(
            "No se pudo cargar el producto."
        );

    }

}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

async function eliminarProducto(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este producto?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                `/productos/${id}`,
                {
                    method: "DELETE"
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                "No se pudo eliminar el producto"
            );

            return;

        }


        alert(
            "Producto eliminado correctamente."
        );


        await cargarProductos();


    } catch (error) {

        console.error("Error:", error);

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// ==========================================
// AGREGAR PRODUCTO A LA VENTA
// ==========================================

btnAgregarVenta.addEventListener(
    "click",
    function () {

        const idProducto =
            Number(productoVenta.value);

        const cantidad =
            Number(cantidadVenta.value);


        if (!idProducto) {

            alert(
                "Selecciona un producto."
            );

            return;

        }


        if (!cantidad || cantidad <= 0) {

            alert(
                "La cantidad debe ser mayor que cero."
            );

            return;

        }


        const producto =
            productos.find(
                p =>
                    Number(p.id_producto) ===
                    idProducto
            );


        if (!producto) {

            alert(
                "Producto no encontrado."
            );

            return;

        }


        const itemExistente =
            carritoVenta.find(
                item =>
                    Number(item.id_producto) ===
                    idProducto
            );


        const cantidadActual =
            itemExistente
                ? itemExistente.cantidad
                : 0;


        if (
            cantidadActual + cantidad >
            Number(producto.stock)
        ) {

            alert(
                `Stock insuficiente. Solo hay ${producto.stock} unidades disponibles.`
            );

            return;

        }


        if (itemExistente) {

            itemExistente.cantidad += cantidad;

            itemExistente.subtotal =
                itemExistente.cantidad *
                Number(itemExistente.precio);

        }

        else {

            carritoVenta.push({

                id_producto:
                    producto.id_producto,

                nombre:
                    producto.nombre,

                cantidad:
                    cantidad,

                precio:
                    Number(producto.precio_venta),

                subtotal:
                    cantidad *
                    Number(producto.precio_venta)

            });

        }


        mostrarCarrito();


        productoVenta.value = "";

        cantidadVenta.value = 1;

    }
);


// ==========================================
// MOSTRAR CARRITO DE VENTA
// ==========================================

function mostrarCarrito() {

    tablaVenta.innerHTML = "";


    if (carritoVenta.length === 0) {

        tablaVenta.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No hay productos en la venta
                </td>
            </tr>
        `;

        totalVenta.textContent =
            formatoMoneda(0);

        return;

    }


    let total = 0;


    carritoVenta.forEach((item, indice) => {

        total += item.subtotal;


        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${item.nombre}
            </td>

            <td>
                ${item.cantidad}
            </td>

            <td>
                ${formatoMoneda(item.precio)}
            </td>

            <td>
                ${formatoMoneda(item.subtotal)}
            </td>

            <td>

                <button
                    class="btn-eliminar"
                    onclick="eliminarDelCarrito(${indice})">
                    Eliminar
                </button>

            </td>
        `;


        tablaVenta.appendChild(fila);

    });


    totalVenta.textContent =
        formatoMoneda(total);

}


// ==========================================
// ELIMINAR PRODUCTO DEL CARRITO
// ==========================================

function eliminarDelCarrito(indice) {

    carritoVenta.splice(indice, 1);

    mostrarCarrito();

}


// ==========================================
// REGISTRAR VENTA
// ==========================================

btnRegistrarVenta.addEventListener(
    "click",
    async function () {

        const id_cliente =
            Number(clienteVenta.value);


        if (!id_cliente) {

            alert(
                "Selecciona un cliente."
            );

            return;

        }


        if (carritoVenta.length === 0) {

            alert(
                "Agrega al menos un producto a la venta."
            );

            return;

        }


        const productosVenta =
            carritoVenta.map(item => ({

                id_producto:
                    item.id_producto,

                cantidad:
                    item.cantidad

            }));


        try {

            const respuesta =
                await fetch(
                    "/ventas",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            id_cliente:
                                id_cliente,

                            productos:
                                productosVenta

                        })

                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                alert(
                    resultado.error ||
                    "No se pudo registrar la venta"
                );

                return;

            }


            alert(
                `Venta registrada correctamente.\n\nNúmero de venta: ${resultado.id_venta}\nTotal: ${formatoMoneda(resultado.total)}`
            );


            // Limpiar venta

            carritoVenta = [];

            mostrarCarrito();

            clienteVenta.value = "";


            // Actualizar productos y stock

            await cargarProductos();


        } catch (error) {

            console.error("Error:", error);

            alert(
                "No se pudo conectar con el servidor."
            );

        }

    }
);


// ==========================================
// BUSCAR PRODUCTOS
// ==========================================

buscar.addEventListener(
    "input",
    function () {

        const texto =
            buscar.value.toLowerCase();


        const resultados =
            productos.filter(producto =>

                producto.codigo
                    .toLowerCase()
                    .includes(texto)

                ||

                producto.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                producto.categoria
                    .toLowerCase()
                    .includes(texto)

                ||

                producto.proveedor
                    .toLowerCase()
                    .includes(texto)

            );


        mostrarProductos(resultados);

    }
);


// ==========================================
// ACTUALIZAR RESUMEN
// ==========================================

function actualizarResumen(lista) {

    totalProductos.textContent =
        lista.length;


    const unidades =
        lista.reduce(

            (total, producto) =>
                total +
                Number(producto.stock),

            0

        );


    totalUnidades.textContent =
        unidades;


    const bajos =
        lista.filter(

            producto =>
                Number(producto.stock) <=
                Number(producto.stock_minimo)

        );


    stockBajo.textContent =
        bajos.length;


    const valor =
        lista.reduce(

            (total, producto) =>
                total +
                (
                    Number(producto.precio_compra) *
                    Number(producto.stock)
                ),

            0

        );


    valorInventario.textContent =
        formatoMoneda(valor);

}


// ==========================================
// FORMATO DE MONEDA
// ==========================================

function formatoMoneda(valor) {

    return new Intl.NumberFormat(
        "es-CO",
        {

            style: "currency",

            currency: "COP",

            maximumFractionDigits: 0

        }
    ).format(valor);

}
// ==========================================
// CARGAR HISTORIAL DE VENTAS
// ==========================================

async function cargarHistorialVentas() {

    try {

        const respuesta =
            await fetch("/ventas");


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar el historial"
            );

        }


        const ventas =
            await respuesta.json();


        tablaVentas.innerHTML = "";


        if (ventas.length === 0) {

            tablaVentas.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        No hay ventas registradas
                    </td>
                </tr>
            `;

            return;
        }


        ventas.forEach(venta => {

            const fila =
                document.createElement("tr");


            const fecha =
                new Date(venta.fecha);


            const fechaFormateada =
                fecha.toLocaleString("es-CO");


            fila.innerHTML = `

                <td>
                    #${venta.id_venta}
                </td>

                <td>
                    ${venta.cliente}
                </td>

                <td>
                    ${fechaFormateada}
                </td>

                <td>
                    ${formatoMoneda(venta.total)}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="verDetalleVenta(${venta.id_venta})">
                        Ver detalle
                    </button>

                </td>

            `;


            tablaVentas.appendChild(fila);

        });


    } catch (error) {

        console.error(
            "Error al cargar historial:",
            error
        );


        tablaVentas.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No se pudo cargar el historial
                </td>
            </tr>
        `;

    }

}
// ==========================================
// CARGAR CLIENTES
// ==========================================

async function cargarClientes() {

    try {

        const respuesta =
            await fetch("/clientes");


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los clientes"
            );

        }


        const clientes =
            await respuesta.json();


        // Actualizar selector de ventas

        clienteVenta.innerHTML = `
            <option value="">
                Seleccionar cliente
            </option>
        `;


        clientes.forEach(cliente => {

            const opcion =
                document.createElement("option");


            opcion.value =
                cliente.id_cliente;


            opcion.textContent =
                `${cliente.nombre} - ${cliente.telefono || "Sin teléfono"}`;


            clienteVenta.appendChild(opcion);

        });


        // Mostrar tabla de clientes

        mostrarClientes(clientes);


    } catch (error) {

        console.error(
            "Error al cargar clientes:",
            error
        );

    }

}


// ==========================================
// MOSTRAR CLIENTES
// ==========================================

function mostrarClientes(clientes) {

    tablaClientes.innerHTML = "";


    if (clientes.length === 0) {

        tablaClientes.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    style="text-align:center;"
                >
                    No hay clientes registrados
                </td>
            </tr>
        `;

        return;

    }


    clientes.forEach(cliente => {

        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${cliente.id_cliente}
            </td>

            <td>
                ${cliente.nombre}
            </td>

            <td>
                ${cliente.telefono || "-"}
            </td>

            <td>
                ${cliente.correo || "-"}
            </td>

            <td>

                <button
                    class="btn-editar"
                    onclick="editarCliente(
                        ${cliente.id_cliente}
                    )"
                >
                    Editar
                </button>


                <button
                    class="btn-eliminar"
                    onclick="eliminarCliente(
                        ${cliente.id_cliente}
                    )"
                >
                    Eliminar
                </button>

            </td>

        `;


        tablaClientes.appendChild(fila);

    });

}
// ==========================================
// GUARDAR / ACTUALIZAR CLIENTE
// ==========================================

formCliente.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nombre =
            nombreCliente.value.trim();


        const telefono =
            telefonoCliente.value.trim();


        const correo =
            correoCliente.value.trim();


        if (!nombre) {

            alert(
                "El nombre del cliente es obligatorio."
            );

            return;

        }


        const cliente = {

            nombre,
            telefono,
            correo

        };


        try {

            const idEditando =
                formCliente.dataset.editando;


            let respuesta;


            if (idEditando) {

                respuesta =
                    await fetch(
                        `/clientes/${idEditando}`,
                        {

                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    cliente
                                )

                        }
                    );

            } else {

                respuesta =
                    await fetch(
                        "/clientes",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    cliente
                                )

                        }
                    );

            }


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                alert(
                    resultado.error ||
                    "No se pudo guardar el cliente"
                );

                return;

            }


            if (idEditando) {

                alert(
                    "Cliente actualizado correctamente."
                );

            } else {

                alert(
                    "Cliente registrado correctamente."
                );

            }


            formCliente.reset();


            delete formCliente.dataset.editando;


            await cargarClientes();


        } catch (error) {

            console.error(
                "Error al guardar cliente:",
                error
            );


            alert(
                "No se pudo conectar con el servidor."
            );

        }

    }
);
// ==========================================
// ELIMINAR CLIENTE
// ==========================================

async function eliminarCliente(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este cliente?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/clientes/${id}`,
                {
                    method: "DELETE"
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                "No se pudo eliminar el cliente"
            );

            return;

        }


        alert(
            "Cliente eliminado correctamente."
        );


        await cargarClientes();


    } catch (error) {

        console.error(
            "Error al eliminar cliente:",
            error
        );


        alert(
            "No se pudo conectar con el servidor."
        );

    }

}

// ==========================================
// INICIAR SISTEMA
// ==========================================

async function iniciarSistema() {

    await cargarCategorias();
    await cargarProveedores();
    await cargarClientes();
    await cargarProductos();
    await cargarHistorialVentas();
    mostrarCarrito();

}

iniciarSistema();