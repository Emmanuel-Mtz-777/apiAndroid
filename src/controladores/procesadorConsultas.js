const conectarBD = require('../configuraciones/bd.js');

const tipoProcesado = {
    ApiAndroid: {
        consultaDatos: async function(consulta){
            const pool = await conectarBD; // Conexión al pool de la base de datos
            try {
                const resultado = await pool.request().query(consulta); // Ejecutar la consulta SQL directamente
                return resultado.recordsets[0]; // Retornar el primer conjunto de registros
            } catch (error) {
                console.error("Error al ejecutar la consulta:", error);
                throw error; // Lanza el error para manejarlo en el controlador
            }
        },
    },
}

module.exports = tipoProcesado;
