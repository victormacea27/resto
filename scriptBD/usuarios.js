const sequelize = require('../conexion');

const BuscarUsuarioPorNombre = async (body) => {
    //console.log(usuario);
    return await sequelize.query(`SELECT * FROM resto.usuarios Where usuario = "${body.usuario}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

module.exports = {
    BuscarUsuarioPorNombre, 
};