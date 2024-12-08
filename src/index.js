const express = require('express');

const cors = require('cors');


const rutasProyecto = {
	rutasUsuarios: require('./rutas/Usuarios.js'),
	
}

const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path: 'src/.env' });


//CORS

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({extended: false}, {limit: '200mb'}));


// Registrar middleware de logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin'
    + ', X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.set('trust proxy', true);

const baseURL = "/api/v2";



//RUTAS DE Api
app.use(baseURL + "/Usuarios", rutasProyecto.rutasUsuarios);


//PUERTO ---
const port = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => {
    console.log('Servidor escuchando en http://0.0.0.0:5000');
});