var Psicologo = require('../models/psicologo')

module.exports = function(app) {

    app.route('/psicologos')
    /* Obtiene psicologos */
        .get(function(req, res){

        var psicologo = new Psicologo();
        var promise = psicologo.findAll();
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    });

    app.route('/psicologos/:id')
    /* Obtiene un psicologo */
        .get(function(req, res){
        var psicologo = new Psicologo();
        var promise = psicologo.findOne(req.params.id);
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    });

    app.route('/psicologos/filtrar')
    /* Obtiene psicologos */
        .post(function(req, res){

            var psicologo = new Psicologo();
            var promise = psicologo.filtrar(req.body);
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