const jwt = require('jsonwebtoken');
const secret = 'WoaOs41E_y~6';

////////////////////////////////////////////////GENERALES///////////////////////////////////////////////////////

//Validación del id
const validarId = (req, res, next) =>{
    const idValidar = req.query.id;
    //console.log(idprueba)
    if (idValidar>0) {
        console.log('Validado es un número');
        return next();
    }else{
        res.status(400).json('Petición invalida, el id debe ser numerico y mayor de cero');
    }
};

//Validar si es administrador o no
const validarAdmin = (req, res, next) => {
    try {
        //console.log(req.body.id_rol);
      if (req.body.id_rol !== 1)
        return res.status(403).json({ error: "La acción que desea realizar solo esta permitida para administradores" });
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

//Validar Token
const validarToken = async (req, res, next) => {
    try {
      const bearerHeader = req.header("Authorization");
      //Quitar Bearer del token
      const token = bearerHeader.replace('Bearer ',''); 
      //console.log(bearerHeader);
      console.log(token);
      if (!bearerHeader) return res.status(401).json({ error: "Error en el token" });
      await jwt.verify(token, secret, (error, data) => {
        if (error) return res.status(401).json({ error: "El token es invalido" });
        req.body.id = data.id;
        req.body.id_rol = data.id_rol;
        //console.log(req.body.id_rol);
        console.log('token validado');
        next();
      });
    } catch (error) {
      res.status(400).json({ error: "Error en el token" });
    }
};

////////////////////////////////////////////////USUARIOS///////////////////////////////////////////////////////

//Validación acceso
const validarLogin = (req, res, next) => {
    try {
        const usuario = req.body.usuario
        const contrasena = req.body.contrasena
        if ((!usuario) && contrasena)
            return res.status(400).json({ error: "Debe ingresar usuario y contraseña" });
            next();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
};

//Validación crear usuario
const validarCrearUsuario = (req, res, next)=>{
    let usuario = req.body;
    //console.log(usuario)
    if(usuario.usuario && usuario.nombre_completo && usuario.email && usuario.telefono && usuario.contrasena){
        console.log(usuario.id_rol);
        if(typeof(usuario.usuario) === "string" 
        && typeof(usuario.nombre_completo) === "string" 
        && typeof(usuario.email) ==="string" 
        && typeof(usuario.telefono) === "string" 
        && typeof(usuario.contrasena) ==="string"
        && typeof(usuario.id_rol === "integer") ){
            //validando RolUsuario
            if (usuario.id_rol !== 1 && usuario.id_rol !== 2 ) {
                return res.send('Debe ingresar el número 1 para Rol de ADMIN ó el número 2 para Rol CLIENTE');
            }
            //validando constraseña 
            if(usuario.contrasena.length < 5){
                return res.send("La constraseña debe ser de mas de 5 caracteres")
            }
            next();
        }else{res.send("Valida que los tipos datos sean correctos")}
    }else{res.send("datos incompletos o incorrectos")}
};

////////////////////////////////////////////////PRODUCTOS///////////////////////////////////////////////////////

//Validar producto nuevo
const ValidarCrearProducto = (req ,res ,next )=>{
    let productos = req.body;
    if(productos.nombre && productos.precio && productos.nombre_corto && productos.ruta){
        if(typeof(productos.nombre) === "string" 
        && typeof(productos.precio) === "number" 
        && typeof(productos.nombre_corto) ==="string" 
        && typeof(productos.ruta) === "string" 
        && typeof(productos.favorito) ==="boolean"){
            next();
        }else{res.status(405).json('Valida que los tipos datos sean correcto')}
    }else{res.status(405).json('Datos incompletos o incorrectos')};
};

//Validar producto modificar
const ValidarModificarProducto = (req ,res ,next )=>{
    let productos = req.body;
    console.log(productos);
    if(productos.nombre && productos.precio && productos.nombre_corto && productos.ruta){
        if(typeof(productos.nombre) === "string" 
        && typeof(productos.precio) === "number" 
        && typeof(productos.nombre_corto) ==="string" 
        && typeof(productos.ruta) === "string" 
        && typeof(productos.favorito) ==="boolean"){
            next();
        }else{res.status(405).json('Valida que los tipos datos sean correcto')}
    }else{res.status(405).json('Datos incompletos')};
};

////////////////////////////////////////////////PEDIDOS///////////////////////////////////////////////////////

//validar estado del pedido
const validarEstado = (req, res, next)  => {
    const idEstado = req.body.id_estado
    if (!idEstado && idEstado < 1 || idEstado > 6) {
        return res.status(400)
            .json('Estado invalido, los posibles estados son: 1:NUEVO, 2:CONFIRMADO, 3:PREPARANDO, 4:ENVIADO, 5:CANCELADO, 6:ENTREGADO');
    }
    return next();
};

module.exports = {
    //Generales
    validarId,
    validarToken,
    validarAdmin,
    //Usuarios
    validarLogin,
    validarCrearUsuario,
    //Estados
    validarEstado,
    //Productos
    ValidarCrearProducto,
    ValidarModificarProducto,
};