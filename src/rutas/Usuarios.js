const express = require('express');
const procesadorConsultas = require('../controladores/procesadorConsultas.js');
const sql = require('mssql');

const ruta = express.Router();
//---------------------------------- Consulta de datos ----------------------------------
// Consulta de usuario por ID
ruta.get('/Usuariosid/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;  // Obtener el usuarioId desde la URL
    

    console.log(`GET /Usuarios/${usuarioId} recibido`);  // Imprimir en consola para ver la solicitud

    // Consulta SQL para obtener un usuario por su ID
    const consulta = `SELECT * FROM Usuarios WHERE IdUsuario = ${usuarioId}`; 

    try {
        // Ejecutar la consulta
        const usuario = await procesadorConsultas.ApiAndroid.consultaDatos(consulta);  

        if (usuario.length > 0) {
            console.log(`Usuario encontrado: ${JSON.stringify(usuario[0])}`);
            return res.json(usuario[0]);  // Retornar el primer usuario encontrado
        } else {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });  // Si no se encuentra el usuario
        }
    } catch (error) {
        console.error("Error al obtener el usuario:", error);  // Mostrar el error en consola
        return res.status(500).json({ mensaje: "Error al obtener el usuario" });  // Devolver mensaje de error si ocurre uno
    }
});

ruta.get('/Usuariosget', async (req, res) => {
    console.log("POST /Usuarios recibido"); 
    const consulta = "SELECT * FROM Usuarios";  // Consulta para obtener todos los usuarios
    try {
        const estaciones = await procesadorConsultas.ApiAndroid.consultaDatos(consulta);  // Ejecutar la consulta
        return res.json(estaciones);  // Retornar los resultados en formato JSON
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);  // Mostrar el error en consola
        return res.status(500).json({ mensaje: "Error al obtener los usuarios" });  // Devolver mensaje de error si ocurre uno
    }
});
//---------------------------------- Inserta de datos ----------------------------------
ruta.post('/Usuarios', async (req, res) => {
    console.log("POST /Usuarios recibido"); 
    console.log(req.body);  // Verifica qué datos están llegando en la solicitud

    const datos = req.body;  // Extraemos los datos del cuerpo de la solicitud

    // Asignamos NULL si 'descripcion' o 'foto' no se envían
    const descripcion = datos.descripcion || null;
    const foto = datos.foto || null;

    // Consulta SQL que maneja los valores NULL para 'descripcion' y 'foto'
    const consulta = `
        INSERT INTO Usuarios (nombre, email, password, descripcion, foto)
        VALUES ('${datos.nombre}', '${datos.email}', '${datos.password}', ${descripcion ? `'${descripcion}'` : 'NULL'}, ${foto ? `'${foto}'` : 'NULL'})
    `;

    try {
        // Ejecutar la consulta usando parámetros para evitar inyecciones SQL
        await procesadorConsultas.ApiAndroid.consultaDatos(consulta);

        return res.status(201).json({ mensaje: 'Usuario creado correctamente' });  // Retornar mensaje de éxito
    } catch (error) {
        console.error("Error al insertar el usuario:", error);  // Mostrar el error en consola
        return res.status(500).json({ mensaje: "Error al crear el usuario" });  // Devolver mensaje de error si ocurre uno
    }
});
ruta.put('/ActualizarUsuario/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;  // Obtener el usuarioId desde la URL
    const datos = req.body;  // Obtener los datos del cuerpo de la solicitud

    console.log(`Usuario con ID ${usuarioId} `);
    console.log(`PUT /Usuarios/ActualizarUsuario/${usuarioId} recibido`);
    console.log(`Datos recibidos: nombre = ${datos.nombre}, descripcion = ${datos.descripcion}`);

    // Consulta SQL parametrizada para evitar inyecciones SQL
    const consulta = `
        UPDATE Usuarios
        SET nombre = @nombre, descripcion = @descripcion
        WHERE IdUsuario = @usuarioId
    `;

    try {
        // Ejecutar la consulta SQL con parámetros
        const request = new sql.Request();
        request.input('nombre', sql.NVarChar, datos.nombre); // Parámetro para 'nombre'
        request.input('descripcion', sql.NVarChar, datos.descripcion); // Parámetro para 'descripcion'
        request.input('usuarioId', sql.Int, usuarioId); // Parámetro para 'usuarioId'

        // Ejecutar la consulta
        const resultado = await request.query(consulta);
        console.log("Resultado de la consulta:", resultado);

        if (resultado.rowsAffected[0] > 0) {
            // Si se ha actualizado al menos un registro
            console.log(`Usuario con ID ${usuarioId} actualizado`);
            return res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
        } else {
            // Si no se ha actualizado ningún registro (posiblemente porque no existe el usuario)
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
});

module.exports = ruta;
