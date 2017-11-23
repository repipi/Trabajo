var Patologia = require('../models/patologia')

module.exports = function(app) {

    /* Obtiene preguntas */
    app.get('/patologia', function(req, res) {
        res.json(Patologia.all());
    });

};