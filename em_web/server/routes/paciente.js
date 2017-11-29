var Paciente = require('../models/paciente');

module.exports = function(app) {


    app.route('/pacientes')
    /* Obtiene pacientes */
        .get(function(req, res) {

        //        var paciente = new Paciente();
        //        paciente.findAll().then(function(all){
        //            if(all) {
        //                res.json(all);
        //            }else {
        //                res.status(401).send('Error en findAll');
        //            }
        //
        //        }).catch(function (err) {
        //            res.status(400).send(err);
        //        });

        //        var paciente = new Paciente();
        //        paciente.findAll(
        //            function(all){
        //                if(all) {
        //                    res.json(all);
        //                }else {
        //                    res.status(401).send('Error en findAll');
        //                }
        //            });

        //        var paciente = new Paciente();
        //        paciente.findAll(req, res);

        var paciente = new Paciente();
        var promise = paciente.findAll();
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            });
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
        console.log("aquiiiiii 2");
        var pacId = parseInt(req.params.id, 10);
        /* Devuelve un objeto JSON Paciente */
        res.json(Paciente.get(pacId));
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