var Paciente = require('../models/paciente')

module.exports = function(app) {

    /* Obtiene pacientes */
    app.get('/pacientes', function(req, res) {
        res.json(Paciente.all());
    });

    /* Obtiene un paciente */
    app.get('/pacientes/:id', function(req, res){
        var pacId = parseInt(req.params.id, 10);
        /* Devuelve un objeto JSON Paciente */
        res.json(Paciente.get(pacId));
    });

    /* Actualiza un paciente */
    app.put('/pacientes/:email', function(req, res) {
        setTimeout(function(){
            res.json(Paciente.update(req.body));
        },1000)
    });

    /* Crea un paciente */
    app.post('/pacientes', function(req, res) {
        setTimeout(function(){
            res.json(Paciente.create(req.body));
        },1000)
    });

};