var express = require('express');
var app = express();

// Load Express Configuration
require('./expressConfig')(app, express);

// Root route
app.get('/', function(req, res){
    res.sendfile('index.html', {root: app.settings.views});
});

// Load routes
require('./routes/preguntas')(app); // preguntas routes
require('./routes/paciente')(app); // paciente routes
require('./routes/patologia')(app); // patologia routes
require('./routes/psicologo')(app); // psicologo routes

module.exports = app;
