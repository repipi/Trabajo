var express = require('express');
/* Se inicializa el servidor de Express */
var app = express();

// Se carga la configuracion de express
require('./expressConfig')(app, express);
require('./config/dbConnection')();
require('./config/session')(app);

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
