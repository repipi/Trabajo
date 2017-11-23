var Preguntas = require('../models/preguntas')

module.exports = function(app) {

    /* Obtiene preguntas */
    app.get('/preguntas', function(req, res) {
        res.json(Preguntas.all());
    });

};