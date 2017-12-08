var express = require('express');
var app = express();
//var mongoDB = require('./dbConnection');
var mongoose = require('mongoose');


// Se carga la configuracion de express
require('./expressConfig')(app, express);

// Se conecta la BBDD
//mongoDB.connect();

var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};

mongoose.connect('mongodb://localhost:27017/emozio', options, function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    }else{
        console.log("Conectado a la BBDD");
    }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Con exito");
});

// Root route
app.get('/', function(req, res){
    res.sendfile('index.html', {root: app.settings.views});
});

// Se cargan las rutas
require('./routes/preguntas')(app); // preguntas routes
require('./routes/paciente')(app); // paciente routes
require('./routes/patologia')(app); // patologia routes
require('./routes/psicologo')(app); // psicologo routes

module.exports = app;
