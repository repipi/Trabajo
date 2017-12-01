var Paciente = require('../models/paciente');

module.exports = function(app) {


    app.route('/pacientes')
    /* Obtiene pacientes */
        .get(function(req, res) {

        var paciente = new Paciente();
        var promise = paciente.findAll();
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    })
    /* Crea un paciente */
        .post(function(req, res) {
        console.log("aquiiiiii 4");
        setTimeout(function(){
            res.json(Paciente.create(req.body));
        },1000)
    })
    /* Actualiza un paciente */
        .put(function(req, res) {
        var paciente = new Paciente();
        var promise = paciente.update(req.body);
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    });

    app.route('/pacientes/:id')
    /* Obtiene un paciente */
        .get(function(req, res){
        var paciente = new Paciente();
        var promise = paciente.findOne(req.params.id);
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    });

    app.route('/pacientes/acceso')
        .post(function(req, res){
        var paciente = new Paciente();
        var promise = paciente.autenticar(req.body);
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    });

};