var Psicologo = require('../models/psicologo')

module.exports = function(app) {

    /* Obtiene psicologos */
    app.get('/psicologos', function(req, res) {
        res.json(Psicologo.all());
    });

    /* Obtiene un psicologo */
    app.get('/psicologos/:id', function(req, res){
        var psicId = parseInt(req.params.id, 10);
        /* Devuelve un objeto JSON Paciente */
        res.json(Psicologo.get(psicId || {}));
    });

};