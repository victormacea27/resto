const sequelize = require('../conexion');

const queryProductos = require('../scriptBD/productos')

const BuscarPedidoPorId = async (id) => {
    //console.log(usuario);
    return await sequelize.query(`SELECT * FROM resto.pedidos Where id = "${id}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const CrearPedidoDetalle = async (detalleOrden) => {
    //console.log(detalleOrden);
    return await sequelize.query(`INSERT INTO resto.detalles_pedidos (id_producto,id_pedido) VALUES ("${detalleOrden.id_producto}","${detalleOrden.id_pedido}");`,
    {
        type: sequelize.QueryTypes.INSERT
    });
};

const CrearPedido = async (id_usuario,id_tipopago) => {
    //console.log(usuario);
    return await sequelize.query(`INSERT INTO resto.pedidos (id_estado,id_usuario,id_tipopago,fecha) VALUES(1,"${id_usuario}","${id_tipopago}",(select now()))`,
    {
        type: sequelize.QueryTypes.INSERT
    });
};

const validarProductosDetalles = async (productos) => {
    //console.log(productos);
    const idproductosRequest = productos.map((prod)=>prod.id_producto);
    console.log('id request '+idproductosRequest.length);
    const idproductosBD = ( await queryProductos.BuscarProductoIds(idproductosRequest)).map((prod)=>prod.id);
    console.log('id BD '+idproductosBD.length);
    if (idproductosRequest.length != idproductosBD.length) {
        const errorDetalle = idproductosRequest
            .filter((prod) => !idproductosBD.includes(prod))
            .map((prod)=>{
                //Especificar id y error del producto
                return{
                    id: prod,
                    mensaje: "No id del producto existe, consulta los productos disponibles",
                }
            });
        return { error: errorDetalle };
    }
};

const crearDetalleOrden = async (id_pedido, productos) =>{
    for (const prod of productos){
        const detalleOrden={
            id_pedido,
            id_producto: prod.id_producto
        };
        console.log(detalleOrden);
        await CrearPedidoDetalle(detalleOrden);
    }
};

module.exports = {
    CrearPedidoDetalle,
    CrearPedido,
    validarProductosDetalles,
    crearDetalleOrden,
    BuscarPedidoPorId
};