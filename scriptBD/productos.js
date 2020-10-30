const sequelize = require('../conexion');

const BuscarProductoID= async (id) => {
    //console.log(usuario);
    return await sequelize.query(`SELECT * FROM resto.productos WHERE id = ${id};`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarProductoIds= async (idsproductos) => {
    //console.log(usuario);
    return await sequelize.query(`SELECT * FROM resto.productos WHERE id in (${idsproductos});`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

module.exports = {
    BuscarProductoID,
    BuscarProductoIds
};