var Psicologo = require('../models/psicologo');
//var passport = require('passport');
//var passportConfig = require('../config/passport_psicologo');
'use strict';
const nodemailer = require('nodemailer');

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

    app.route('/psicologos/acceso')
        .post(function(req, res, next){
//        passport.authenticate('local', function(error, psicologo, info){
//            if(error){
//                return next(error);
//            }
//            /* SI no encontramos al psicologo en la BBDD */
//            if(!psicologo) {
//                //                return res.status(400).send('Email o contraseña no validos');
//                //return res.send('Email o contraseña no validos');
//                return res.send(null);
//            }else{
//                req.login(psicologo, {}, function(err) {
//                    if (err) { return next(err) };
//                    return res.json(psicologo);
//                });
//            }
//        })(req, res, next);//Funcion que devuelve passport y que debe ser invocada de esta forma
    });

//    app.route('/psicologos/cierre')
//        .post(passportConfig.estaAutenticado, function(req, res){
//        req.logout("Logout exitoso");
//    });

    app.route('/psicologos/registro')
        .post(function(req, res, next){
        //        Como configurar correctamente el correo
        //        https://deivijt.com/blog/como-enviar-emails-con-nodejs-y-nodemailer/


        /* Para enviar un email, se define un transporter con los datos de la cuenta de correo */
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'raquelgilmartinez@gmail.com',
                pass: 'contraseñita'
            }
        });

        /* Se define el mail que vamos a enviar */
        var mailOptions = {
            from: 'raquelgilmartinez@gmail.com',
            to: 'raquelgilmartinez@gmail.com',
            subject: 'Asunto',
            text: JSON.stringify(req.body)
        };

        // Se envia el mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });

};