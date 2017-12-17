var Paciente = require('../models/paciente');
var passport = require('passport');
var passportConfig = require('../config/passport');

module.exports = function(app) {


    app.route('/pacientes')
    /* Obtiene pacientes */
//        .get(function(req, res) {
//
//        console.log(req.user);
//
//        var paciente = new Paciente();
//        var promise = paciente.findAll();
//        promise.then(
//            function(data){
//                res.send(data);
//            },
//            function (error){
//                res.status(500).send({error: error});
//            }
//        );
//    })

    //    app.get('/pacienteInfo', passportConfig.estaAutenticado, function(req, res){
    //    res.json(req.user);
    //})

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

    app.route('/pacientes')
    /* Obtiene un paciente */
        .get(function(req, res){
        var paciente = new Paciente();
        var promise = paciente.findOne(req.user._id);
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    });

    app.route('/pacientes/registro')
        .post(function(req, res, next){
        var paciente = new Paciente();
        var promise = paciente.darAlta(req.body, next);
        promise.then(function(){
            passport.authenticate('local', function(error, paciente, info){
                if(error){
                    return next(error);
                }
                /* SI no encontramos al paciente en la BBDD */
                if(!paciente) {
                    return res.status(400).send('Email o contraseña no validos');
                }else{
                    req.login(paciente, {}, function(err) {
                        if (err) { return next(err) };
                        return res.json(paciente);
                    });
                }
            })(req, res, next);//Funcion que devuelve passport y que debe ser invocada de esta forma
        }
                    );
    });

    app.route('/pacientes/acceso')
        .post(function(req, res, next){
        passport.authenticate('local', function(error, paciente, info){
            if(error){
                return next(error);
            }
            /* SI no encontramos al paciente en la BBDD */
            if(!paciente) {
                return res.status(400).send('Email o contraseña no validos');
            }else{
                req.login(paciente, {}, function(err) {
                    if (err) { return next(err) };
                    return res.json(paciente);
                });
            }
        })(req, res, next);//Funcion que devuelve passport y que debe ser invocada de esta forma
    });

    app.route('/pacientes/cierre')
        .post(passportConfig.estaAutenticado, function(req, res){
        req.logout("Logout exitoso");
    });

    app.route('/pacientes/diagnostico')
    /* Obtiene el diagnostico de un paciente */
        .get(function(req, res){
        var paciente = new Paciente();
        var promise = paciente.findDiagnostico(req.user._id);
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    });
    
    app.route('/pacientes/psicologos')
    /* Obtiene el diagnostico de un paciente */
        .get(function(req, res){
        var paciente = new Paciente();
        var promise = paciente.findPsicologos(req.user._id);
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