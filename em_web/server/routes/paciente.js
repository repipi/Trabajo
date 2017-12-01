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
    });

    app.route('/pacientes/:id')
    /* Obtiene un paciente */
        .get(function(req, res){
        var pacId = parseInt(req.params.id, 10);
        var paciente = new Paciente();
        var promise = paciente.findOne(pacId);
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    })
    /* Actualiza un paciente */
        .put(function(req, res) {
        console.log("aquiiiiii 3");
        setTimeout(function(){
            res.json(Paciente.update(req.body));
        },1000)
    });

    app.route('/pacientes/acceso')
        .post(function(req, res){
        console.log("aquiiiiii");
        res.json(Paciente.autenticar(req.body));
    });

};