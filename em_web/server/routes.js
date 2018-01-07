var express = require('express');
/* Se inicializa el servidor de Express */
var app = express();
//var mongoDB = require('./dbConnection');
var mongoose = require('mongoose');
/* Al combinar la session con MongoStore se crea automaticamente una coleccion de sesiones */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

var MONGO_URL = 'mongodb://localhost:27017/emozio';


// Se carga la configuracion de express
require('./expressConfig')(app, express);

var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};

/* Se determina que mongoose utilice las mismas promise que NodeJS */
mongoose.Promise = global.Promise;

// Se conecta la BBDD
mongoose.connect(MONGO_URL, options, function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    }else{
        console.log("Conectado a la BBDD");
    }
});

var db = mongoose.connection;
/* Si sucede un error, mostrarlo */
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Con exito");
});

//var Paciente = require('./models/paciente');
//var p = new Paciente({
//    email: 'rgm3@gmail.com',
//    password: '1234',
//    localizacion: 'Ames',
//    telefono: 214615398
//})
//p.save()
//    .then(function(){
//    console.log('guardado');
//})
//    .catch(function(error){
//           console.log(error);
//})

//Utiliza el middleware Session
app.use(session({
    /* El algoritmo de criptografia utilizado utiliza esta propiedad como salt para encriptar */
    secret: 'ESTO ES SECRETO',
    /* Por cada llamada realizada al servidor, la sesion se guardara en la BBDD */
    resave: true,
    /* Cuando se realiza la llamada por primera vez, guarda un objeto vacio con informacion de esa session */
    saveUninitialized: true,
    store: new MongoStore({
        url: MONGO_URL,
        /* autoReconnect: Si sucede un error, trata de volver a conectarse */
        autoReconnect: true
    })
}));

/* Inicializa passport */
app.use(passport.initialize());
/* Utiliza las sesiones de passport */
app.use(passport.session());

// Root route
app.get('/', function(req, res){
    //    req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
    //    res.send( 'Veces vistas: '+req.session.cuenta);
    res.sendfile('index.html', {root: app.settings.views});
});

// Se cargan las rutas
require('./routes/paciente')(app); // paciente routes
require('./routes/patologia')(app); // patologia routes
require('./routes/psicologo')(app); // psicologo routes
require('./routes/mensaje')(app); // mensaje routes

module.exports = app;
