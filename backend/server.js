// ==========================================
// IMPORTAR LIBRERÍAS
// ==========================================

const express = require("express");
const db = require("./db");


// ==========================================
// CREAR APLICACIÓN
// ==========================================

const app = express();

const PORT = 3000;


// ==========================================
// CONFIGURACIONES
// ==========================================

app.use(express.json());

app.use(express.static("public"));


// ==========================================
// RUTA DE PRUEBA
// ==========================================

app.get("/prueba", (req, res) => {

    res.send("Servidor funcionando correctamente");

});


// ==========================================
// OBTENER CATEGORÍAS
// ==========================================

app.get("/categorias", (req, res) => {

    const sql = `
        SELECT
            id_categoria,
            nombre,
            descripcion
        FROM categorias
        ORDER BY nombre ASC
    `;

    db.query(sql, (error, resultados) => {

        if (error) {

            console.error(
                "Error al consultar categorías:",
                error
            );

            return res.status(500).json({
                error: "No se pudieron consultar las categorías"
            });

        }

        res.json(resultados);

    });

});
// ==========================================
// REGISTRAR CATEGORÍA
// ==========================================

app.post("/categorias", (req, res) => {

    const {
        nombre,
        descripcion
    } = req.body;

    if (!nombre || nombre.trim() === "") {

        return res.status(400).json({
            error: "El nombre de la categoría es obligatorio"
        });

    }

    const sql = `
        INSERT INTO categorias
        (nombre, descripcion)
        VALUES (?, ?)
    `;

    const valores = [
        nombre.trim(),
        descripcion || null
    ];

    db.query(sql, valores, (error, resultado) => {

        if (error) {

            console.error(
                "Error al registrar categoría:",
                error
            );

            if (error.code === "ER_DUP_ENTRY") {

                return res.status(400).json({
                    error: "Esa categoría ya existe"
                });

            }

            return res.status(500).json({
                error: "No se pudo registrar la categoría"
            });

        }

        res.status(201).json({

            mensaje:
                "Categoría registrada correctamente",

            id_categoria:
                resultado.insertId

        });

    });

});


// ==========================================
// ACTUALIZAR CATEGORÍA
// ==========================================

app.put("/categorias/:id", (req, res) => {

    const id = req.params.id;

    const {
        nombre,
        descripcion
    } = req.body;

    if (!nombre || nombre.trim() === "") {

        return res.status(400).json({
            error: "El nombre de la categoría es obligatorio"
        });

    }

    const sql = `
        UPDATE categorias
        SET
            nombre = ?,
            descripcion = ?
        WHERE id_categoria = ?
    `;

    const valores = [
        nombre.trim(),
        descripcion || null,
        id
    ];

    db.query(sql, valores, (error, resultado) => {

        if (error) {

            console.error(
                "Error al actualizar categoría:",
                error
            );

            if (error.code === "ER_DUP_ENTRY") {

                return res.status(400).json({
                    error: "Esa categoría ya existe"
                });

            }

            return res.status(500).json({
                error: "No se pudo actualizar la categoría"
            });

        }

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                error: "Categoría no encontrada"
            });

        }

        res.json({
            mensaje:
                "Categoría actualizada correctamente"
        });

    });

});


// ==========================================
// ELIMINAR CATEGORÍA
// ==========================================

app.delete("/categorias/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM categorias
        WHERE id_categoria = ?
    `;

    db.query(sql, [id], (error, resultado) => {

        if (error) {

            console.error(
                "Error al eliminar categoría:",
                error
            );

            if (error.code === "ER_ROW_IS_REFERENCED_2") {

                return res.status(400).json({
                    error:
                        "No se puede eliminar esta categoría porque tiene productos relacionados."
                });

            }

            return res.status(500).json({
                error:
                    "No se pudo eliminar la categoría"
            });

        }

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                error: "Categoría no encontrada"
            });

        }

        res.json({
            mensaje:
                "Categoría eliminada correctamente"
        });

    });

});


// ==========================================
// OBTENER PROVEEDORES
// ==========================================

app.get("/proveedores", (req, res) => {

    const sql = `
        SELECT
            id_proveedor,
            nombre,
            telefono,
            correo,
            direccion
        FROM proveedores
        ORDER BY nombre ASC
    `;

    db.query(sql, (error, resultados) => {

        if (error) {

            console.error(
                "Error al consultar proveedores:",
                error
            );

            return res.status(500).json({
                error: "No se pudieron consultar los proveedores"
            });

        }

        res.json(resultados);

    });

});


// ==========================================
// OBTENER CLIENTES
// ==========================================

app.get("/clientes", (req, res) => {

    const sql = `
        SELECT
            id_cliente,
            nombre,
            telefono,
            correo
        FROM clientes
        ORDER BY nombre ASC
    `;

    db.query(sql, (error, resultados) => {

        if (error) {

            console.error(
                "Error al consultar clientes:",
                error
            );

            return res.status(500).json({
                error: "No se pudieron consultar los clientes"
            });

        }

        res.json(resultados);

    });

});
// ==========================================
// REGISTRAR CLIENTE
// ==========================================

app.post("/clientes", (req, res) => {

    const {
        nombre,
        telefono,
        correo
    } = req.body;


    if (!nombre || nombre.trim() === "") {

        return res.status(400).json({
            error: "El nombre del cliente es obligatorio"
        });

    }


    const sql = `
        INSERT INTO clientes
        (nombre, telefono, correo)
        VALUES (?, ?, ?)
    `;


    const valores = [
        nombre.trim(),
        telefono || null,
        correo || null
    ];


    db.query(sql, valores, (error, resultado) => {

        if (error) {

            console.error(
                "Error al registrar cliente:",
                error
            );

            return res.status(500).json({
                error: "No se pudo registrar el cliente"
            });

        }


        res.status(201).json({

            mensaje: "Cliente registrado correctamente",

            id_cliente: resultado.insertId

        });

    });

});


// ==========================================
// ACTUALIZAR CLIENTE
// ==========================================

app.put("/clientes/:id", (req, res) => {

    const id = req.params.id;


    const {
        nombre,
        telefono,
        correo
    } = req.body;


    if (!nombre || nombre.trim() === "") {

        return res.status(400).json({
            error: "El nombre del cliente es obligatorio"
        });

    }


    const sql = `
        UPDATE clientes

        SET
            nombre = ?,
            telefono = ?,
            correo = ?

        WHERE id_cliente = ?
    `;


    const valores = [
        nombre.trim(),
        telefono || null,
        correo || null,
        id
    ];


    db.query(sql, valores, (error, resultado) => {

        if (error) {

            console.error(
                "Error al actualizar cliente:",
                error
            );

            return res.status(500).json({
                error: "No se pudo actualizar el cliente"
            });

        }


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                error: "Cliente no encontrado"
            });

        }


        res.json({
            mensaje: "Cliente actualizado correctamente"
        });

    });

});


// ==========================================
// ELIMINAR CLIENTE
// ==========================================

app.delete("/clientes/:id", (req, res) => {

    const id = req.params.id;


    const sql = `
        DELETE FROM clientes
        WHERE id_cliente = ?
    `;


    db.query(sql, [id], (error, resultado) => {

        if (error) {

            console.error(
                "Error al eliminar cliente:",
                error
            );


            // El cliente puede tener ventas relacionadas
            if (error.code === "ER_ROW_IS_REFERENCED_2") {

                return res.status(400).json({
                    error:
                        "No se puede eliminar este cliente porque tiene ventas registradas."
                });

            }


            return res.status(500).json({
                error: "No se pudo eliminar el cliente"
            });

        }


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                error: "Cliente no encontrado"
            });

        }


        res.json({
            mensaje: "Cliente eliminado correctamente"
        });

    });

});


// ==========================================
// OBTENER PRODUCTOS
// ==========================================

app.get("/productos", (req, res) => {

    const sql = `
        SELECT
            p.id_producto,
            p.codigo,
            p.nombre,

            p.id_categoria,
            c.nombre AS categoria,

            p.id_proveedor,
            pr.nombre AS proveedor,

            p.precio_compra,
            p.precio_venta,
            p.stock,
            p.stock_minimo

        FROM productos p

        INNER JOIN categorias c
            ON p.id_categoria = c.id_categoria

        INNER JOIN proveedores pr
            ON p.id_proveedor = pr.id_proveedor

        ORDER BY p.id_producto ASC
    `;

    db.query(sql, (error, resultados) => {

        if (error) {

            console.error(
                "Error al consultar productos:",
                error
            );

            return res.status(500).json({
                error: "No se pudieron consultar los productos"
            });

        }

        res.json(resultados);

    });

});


// ==========================================
// OBTENER HISTORIAL DE VENTAS
// ==========================================

app.get("/ventas", (req, res) => {

    const sql = `
        SELECT
            v.id_venta,
            c.nombre AS cliente,
            v.fecha,
            v.total
        FROM ventas v

        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente

        ORDER BY v.id_venta DESC
    `;


    db.query(sql, (error, resultados) => {

        if (error) {

            console.error(
                "Error al consultar ventas:",
                error
            );

            return res.status(500).json({
                error: "No se pudo consultar el historial de ventas"
            });

        }


        res.json(resultados);

    });

});


// ==========================================
// OBTENER DETALLE DE UNA VENTA
// ==========================================

app.get("/ventas/:id", (req, res) => {

    const id = req.params.id;


    const sql = `
        SELECT
            v.id_venta,
            c.nombre AS cliente,
            v.fecha,
            v.total,

            p.codigo,
            p.nombre AS producto,

            dv.cantidad,
            dv.precio,
            dv.subtotal

        FROM ventas v

        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente

        INNER JOIN detalle_ventas dv
            ON v.id_venta = dv.id_venta

        INNER JOIN productos p
            ON dv.id_producto = p.id_producto

        WHERE v.id_venta = ?

        ORDER BY dv.id_detalle ASC
    `;


    db.query(
        sql,
        [id],
        (error, resultados) => {

            if (error) {

                console.error(
                    "Error al consultar detalle de venta:",
                    error
                );

                return res.status(500).json({
                    error:
                        "No se pudo consultar el detalle de la venta"
                });

            }


            if (resultados.length === 0) {

                return res.status(404).json({
                    error: "Venta no encontrada"
                });

            }


            res.json(resultados);

        }
    );

});


// ==========================================
// REGISTRAR PRODUCTO
// ==========================================

app.post("/productos", (req, res) => {

    const {
        codigo,
        nombre,
        id_categoria,
        id_proveedor,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo
    } = req.body;


    const sql = `
        INSERT INTO productos
        (
            codigo,
            nombre,
            id_categoria,
            id_proveedor,
            precio_compra,
            precio_venta,
            stock,
            stock_minimo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const valores = [
        codigo,
        nombre,
        id_categoria,
        id_proveedor,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo
    ];


    db.query(
        sql,
        valores,
        (error, resultado) => {

            if (error) {

                console.error(
                    "Error al registrar producto:",
                    error
                );

                return res.status(500).json({
                    error:
                        "No se pudo registrar el producto"
                });

            }


            res.status(201).json({

                mensaje:
                    "Producto registrado correctamente",

                id_producto:
                    resultado.insertId

            });

        }
    );

});


// ==========================================
// ACTUALIZAR PRODUCTO
// ==========================================

app.put("/productos/:id", (req, res) => {

    const id = req.params.id;


    const {
        codigo,
        nombre,
        id_categoria,
        id_proveedor,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo
    } = req.body;


    const sql = `
        UPDATE productos

        SET
            codigo = ?,
            nombre = ?,
            id_categoria = ?,
            id_proveedor = ?,
            precio_compra = ?,
            precio_venta = ?,
            stock = ?,
            stock_minimo = ?

        WHERE id_producto = ?
    `;


    const valores = [
        codigo,
        nombre,
        id_categoria,
        id_proveedor,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo,
        id
    ];


    db.query(
        sql,
        valores,
        (error, resultado) => {

            if (error) {

                console.error(
                    "Error al actualizar producto:",
                    error
                );

                return res.status(500).json({
                    error:
                        "No se pudo actualizar el producto"
                });

            }


            if (resultado.affectedRows === 0) {

                return res.status(404).json({
                    error: "Producto no encontrado"
                });

            }


            res.json({
                mensaje:
                    "Producto actualizado correctamente"
            });

        }
    );

});


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

app.delete("/productos/:id", (req, res) => {

    const id = req.params.id;


    const sql = `
        DELETE FROM productos
        WHERE id_producto = ?
    `;


    db.query(
        sql,
        [id],
        (error, resultado) => {

            if (error) {

                console.error(
                    "Error al eliminar producto:",
                    error
                );

                return res.status(500).json({
                    error:
                        "No se pudo eliminar el producto"
                });

            }


            if (resultado.affectedRows === 0) {

                return res.status(404).json({
                    error:
                        "Producto no encontrado"
                });

            }


            res.json({
                mensaje:
                    "Producto eliminado correctamente"
            });

        }
    );

});


// ==========================================
// REGISTRAR VENTA
// ==========================================

app.post("/ventas", (req, res) => {

    const {
        id_cliente,
        productos
    } = req.body;


    if (!id_cliente) {

        return res.status(400).json({
            error: "Debes indicar el cliente"
        });

    }


    if (
        !Array.isArray(productos) ||
        productos.length === 0
    ) {

        return res.status(400).json({
            error:
                "La venta debe tener al menos un producto"
        });

    }


    db.beginTransaction((error) => {

        if (error) {

            console.error(
                "Error al iniciar transacción:",
                error
            );

            return res.status(500).json({
                error:
                    "No se pudo iniciar la venta"
            });

        }


        const sqlVenta = `
            INSERT INTO ventas
            (id_cliente, total)
            VALUES (?, 0)
        `;


        db.query(
            sqlVenta,
            [id_cliente],
            (error, resultadoVenta) => {

                if (error) {

                    return db.rollback(() => {

                        console.error(
                            "Error al crear venta:",
                            error
                        );

                        res.status(500).json({
                            error:
                                "No se pudo crear la venta"
                        });

                    });

                }


                const idVenta =
                    resultadoVenta.insertId;


                let totalVenta = 0;


                const procesarProducto = (indice) => {


                    if (indice >= productos.length) {

                        const sqlTotal = `
                            UPDATE ventas
                            SET total = ?
                            WHERE id_venta = ?
                        `;


                        return db.query(
                            sqlTotal,
                            [totalVenta, idVenta],
                            (error) => {

                                if (error) {

                                    return db.rollback(() => {

                                        console.error(
                                            "Error al actualizar total:",
                                            error
                                        );

                                        res.status(500).json({
                                            error:
                                                "No se pudo actualizar el total"
                                        });

                                    });

                                }


                                db.commit((error) => {

                                    if (error) {

                                        return db.rollback(() => {

                                            console.error(
                                                "Error al confirmar venta:",
                                                error
                                            );

                                            res.status(500).json({
                                                error:
                                                    "No se pudo confirmar la venta"
                                            });

                                        });

                                    }


                                    res.status(201).json({

                                        mensaje:
                                            "Venta registrada correctamente",

                                        id_venta:
                                            idVenta,

                                        total:
                                            totalVenta

                                    });

                                });

                            }
                        );

                    }


                    const item =
                        productos[indice];


                    const idProducto =
                        Number(item.id_producto);


                    const cantidad =
                        Number(item.cantidad);


                    if (
                        !idProducto ||
                        !cantidad ||
                        cantidad <= 0
                    ) {

                        return db.rollback(() => {

                            res.status(400).json({
                                error:
                                    "Producto o cantidad inválida"
                            });

                        });

                    }


                    const sqlProducto = `
                        SELECT
                            precio_venta,
                            stock
                        FROM productos
                        WHERE id_producto = ?
                        FOR UPDATE
                    `;


                    db.query(
                        sqlProducto,
                        [idProducto],
                        (error, resultados) => {

                            if (error) {

                                return db.rollback(() => {

                                    console.error(
                                        "Error al consultar producto:",
                                        error
                                    );

                                    res.status(500).json({
                                        error:
                                            "No se pudo consultar el producto"
                                    });

                                });

                            }


                            if (resultados.length === 0) {

                                return db.rollback(() => {

                                    res.status(404).json({
                                        error:
                                            "Uno de los productos no existe"
                                    });

                                });

                            }


                            const producto =
                                resultados[0];


                            if (
                                Number(producto.stock) <
                                cantidad
                            ) {

                                return db.rollback(() => {

                                    res.status(400).json({
                                        error:
                                            "No hay suficiente stock para el producto"
                                    });

                                });

                            }


                            const precio =
                                Number(producto.precio_venta);


                            const subtotal =
                                precio * cantidad;


                            totalVenta += subtotal;


                            const sqlDetalle = `
                                INSERT INTO detalle_ventas
                                (
                                    id_venta,
                                    id_producto,
                                    cantidad,
                                    precio,
                                    subtotal
                                )
                                VALUES (?, ?, ?, ?, ?)
                            `;


                            db.query(
                                sqlDetalle,
                                [
                                    idVenta,
                                    idProducto,
                                    cantidad,
                                    precio,
                                    subtotal
                                ],
                                (error) => {

                                    if (error) {

                                        return db.rollback(() => {

                                            console.error(
                                                "Error al registrar detalle:",
                                                error
                                            );

                                            res.status(500).json({
                                                error:
                                                    "No se pudo registrar el detalle"
                                            });

                                        });

                                    }


                                    const sqlStock = `
                                        UPDATE productos
                                        SET stock = stock - ?
                                        WHERE id_producto = ?
                                    `;


                                    db.query(
                                        sqlStock,
                                        [
                                            cantidad,
                                            idProducto
                                        ],
                                        (error) => {

                                            if (error) {

                                                return db.rollback(() => {

                                                    console.error(
                                                        "Error al descontar stock:",
                                                        error
                                                    );

                                                    res.status(500).json({
                                                        error:
                                                            "No se pudo actualizar el stock"
                                                    });

                                                });

                                            }


                                            procesarProducto(
                                                indice + 1
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                };


                procesarProducto(0);

            }
        );

    });

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );

});