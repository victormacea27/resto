const express = require('express');
const app = express();
app.use(express.json());

const jwt = require('jsonwebtoken');
const secret = 'WoaOs41E_y~6'

const sequelize = require('./conexion.js');

const validaciones = require('./middlewares/validaciones.js')

const validacionesToken = require('./middlewares/validaciones.js');

const queryPedidos = require('./scriptBD/pedidos.js');

const queryUsuarios = require('./scriptBD/usuarios');

const queryProductos = require('./scriptBD/productos');

////////////////////////////////////////////////USUARIO///////////////////////////////////////////////////////

//Buscar todos los usuarios
app.get('/usuarios',validaciones.validarToken,validaciones.validarAdmin, (req,res)=>{
    sequelize.query("SELECT * FROM resto.usuarios;",
    {
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

// Ingresar usuario
app.post('/login', validacionesToken.validarLogin, async (req,res)=>{
    try {
        //Buscar usuario por usuario
        const usuario = await queryUsuarios.BuscarUsuarioPorNombre(req.body);
        const contrasena = req.body.contrasena;
        //Si no lo encuentra length es 0
        if (!usuario.length) {
        return res.status(401).json({ error: "Usuario no registrado" });
        }
        console.log(usuario[0].contrasena);
        console.log(contrasena);
        //Generar token
        if (usuario[0].contrasena == contrasena) {
            console.log('Entro al pyload');
            console.log(secret);
            const payload = {
              id: usuario[0].id,
              usuario: usuario[0].usuario,
              nombre_completo: usuario[0].nombre_completo,
              id_rol: usuario[0].id_rol
            }
            const token = jwt.sign(payload, secret);
            console.log(token);
            return res.header("auth-token", token).json({ token });
          }else {
              //Contraseña incorrecta
                return res.status(404).json({ error: "Contraseña incorrecta valida los datos e ingresa nuevamente" });
          }
    } catch (error) {
        res.status(401).json({ error: error.message });
      }
});

//Crear Usuario
app.post('/crearUsuario',validaciones.validarCrearUsuario, async (req,res)=>{
    const usuario = await queryUsuarios.BuscarUsuarioPorNombre(req.body);
    console.log(usuario.length);
    if (usuario.length) {
        return res.status(405).json({ error: "El usuario ya existe" });
    }
    sequelize.query("INSERT INTO `resto`.`usuarios` (`usuario`,`nombre_completo`,`email`,`telefono`,`direccion_envio`,`contrasena`,`id_rol`) VALUES (?,?,?,?,?,?,?);",
    {
        replacements:[req.body.usuario,req.body.nombre_completo,req.body.email,req.body.telefono,req.body.direccion_envio,req.body.contrasena,req.body.id_rol],
        type: sequelize.QueryTypes.INSERT
    }).then(result =>{
        res.status(200).json('nuevo usuario creado: ' + req.body.nombre_completo);
    }).catch(err=>{
        res.status(500).json(err);
    })
 });

 //Buscar un usuarios en especifico
app.get('/buscarUsuario',validaciones.validarId,(req,res)=>{
    //console.log(req.query.id);
    sequelize.query("SELECT * FROM resto.usuarios WHERE id = ?;",
    {
        replacements:[req.query.id],
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    })
});

 //////////////////////////////////////////////// Productos ///////////////////////////////
//Buscar todos los usuarios
app.get('/productos',validaciones.validarToken,(req,res)=>{
    sequelize.query("SELECT * FROM resto.productos;",
    {
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    })
});

//Crear Producto
app.post('/crearProducto',validaciones.ValidarCrearProducto,validaciones.validarToken,validaciones.validarAdmin, async (req,res)=>{
    //console.log(req.body);
     sequelize.query("INSERT INTO `resto`.`productos` (`nombre`,`precio`,`nombre_corto`,`ruta`,`favorito`) VALUES (?,?,?,?,?);",
     {
         replacements:[req.body.nombre,req.body.precio,req.body.nombre_corto,req.body.ruta,req.body.favorito],
         type: sequelize.QueryTypes.INSERT
     }).then(result =>{
         res.status(200).json('nuevo producto creado: ' + req.body.nombre);
     }).catch(err=>{
         res.status(500).json(err);
     })
 });

//Modificar producto
//localhost:8000/modificarProducto?id_producto=
app.put('/modificarProducto',validaciones.ValidarModificarProducto, validaciones.validarToken,validaciones.validarAdmin, async (req,res)=>{
    console.log(req.query.id_producto);
    const ProductoExiste = await queryProductos.BuscarProductoID(req.query.id_producto);
    console.log(ProductoExiste.length);
    if (ProductoExiste.length) {
        sequelize.query("UPDATE `resto`.`productos` SET `nombre` = ?, `precio` = ?, `nombre_corto` = ?, `ruta` = ?, `favorito` = ? WHERE `id` = ?;",
        {
            replacements:[req.body.nombre,req.body.precio,req.body.nombre_corto,req.body.ruta,req.body.favorito,req.query.id_producto],
            type: sequelize.QueryTypes.UPDATE
        }).then(result =>{
            res.status(200).json('Producto: ' + req.body.nombre + ' modificado');
        }).catch(err=>{
            res.status(500).json(err);
        })
    } else{
        return res.status(404).json({ error: 'El producto no existe, valida el id' });
    }
 });

//Eliminar producto
 app.delete('/eliminarProducto',validaciones.validarId, validaciones.validarToken,validaciones.validarAdmin, async(req,res)=>{
    console.log(req.query.id);
    const producto = await queryProductos.BuscarProductoID(req.query.id);
    console.log(producto.length);
    if (producto.length) {
        sequelize.query("DELETE FROM `resto`.`productos` WHERE id = ?;",
        {
            replacements:[req.query.id],
            type: sequelize.QueryTypes.DELETE
        }).then(result =>{
            res.status(200).json('id del producto eliminado: ' + req.query.id);
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(404).json({ error: 'El producto no existe, valida el id' });
    }
});

//////////////////////////////////////////////// Pedidos  ///////////////////////////////
//Buscar todos los pedidos
app.get('/pedidos',validaciones.validarToken, async (req,res)=>{
    sequelize.query(`SELECT 
    P.id AS NroPedido
    ,E.nombre AS Estado
    ,U.nombre_completo AS Usuario
    ,TP.nombre AS FormaPago
    ,(Select sum(precio)
    from resto.detalles_pedidos ped
    join resto.productos prod
    on ped.id_producto = prod.id
    where  id_pedido = P.id) AS PAgoTotal
    ,(Select  group_concat(prod.nombre)
    from resto.detalles_pedidos ped
    join resto.productos prod
    on ped.id_producto = prod.id
    where  id_pedido = P.id
    group by id_pedido) AS DescripciónProductos
    ,P.fecha AS FechaPedido
    FROM resto.pedidos P
    JOIN resto.usuarios U on P.id_usuario =  U.id
    JOIN resto.tipo_pagos TP on p.id_tipopago = TP.id
    JOIN resto.estados E on p.id_tipopago = E.id;`,
    {
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    })
});

 //Modificar estado
 //localhost:8000/modificarPedido?id_pedido=
 app.put('/modificarPedido', validaciones.validarToken,validaciones.validarAdmin, validaciones.validarEstado, async  (req,res)=>{
    console.log(req.query.id_pedido);
    //console.log(req.body.id_estado);
    const pedido = await queryPedidos.BuscarPedidoPorId(req.query.id_pedido);
    //console.log(pedido.length);
    if (pedido.length) {
        sequelize.query("UPDATE `resto`.`pedidos` SET `id_estado` = ?  WHERE `id` = ?;",
        {
            replacements:[req.body.id_estado,req.query.id_pedido],
            type: sequelize.QueryTypes.UPDATE
        }).then(result =>{
            res.status(200).json('Estado modificado');
        }).catch(err=>{
            res.status(500).json(err);
        })
    } else{
        return res.status(404).json({ error: 'El pedido no existe, valida el id' });
    }
 });

app.post('/pedidoNuevo', validaciones.validarToken, async(req,res)=>{
    try{
        const ValidarProductos = await queryPedidos.validarProductosDetalles(req.body.productos);
        //Si no existe un producto reportar error
        if (ValidarProductos && ValidarProductos.error)
        return res
          .status(400)
          .json({ error: 400, errorDetalle: ValidarProductos.error });
          //console.log('admin id: ' + req.body.id);
        const crearPedido = await queryPedidos.CrearPedido(req.body.id,req.body.id_tipopago);
        //console.log('id del pedido: ' + crearPedido[0]);
        await queryPedidos.crearDetalleOrden(crearPedido[0],req.body.productos);
        res.json(req.body);
    }  catch (error) {
    res.status(500).json({ error: error.message });
    }
});


//Eliminar producto
app.delete('/eliminarPedido',validaciones.validarId, validaciones.validarToken,validaciones.validarAdmin, async(req,res)=>{
    const pedidoExiste = await queryPedidos.BuscarPedidoPorId(req.query.id);
    if (pedidoExiste.length) {
    const pedidoEliminado = await queryPedidos.EliminarPedidoPorId(req.query.id);
    console.log('paso por aqui');
        sequelize.query("DELETE FROM resto.pedidos WHERE  id = ?;",
        {
            replacements:[req.query.id],
            type: sequelize.QueryTypes.DELETE
        }).then(result =>{
            res.status(200).json('id del pedido eliminado: ' + req.query.id);
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(404).json({ error: 'El pedido no existe, valida el id' });
    }
});


app.listen(8000,()=>{
    console.log('servidor corriendo')
});

