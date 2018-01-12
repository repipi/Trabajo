var Psicologo = require('../models/psicologo');
var passport = require('passport');
var passportConfig = require('../config/passport');
'use strict';
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const xoauth2 = require('xoauth2');

module.exports = function(app) {

	app.route('/psicologos')
	/* Obtiene a todos los psicologos */
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

	app.route('/psicologo')
	/* Obtiene al psicologo que tiene iniciada la sesion */
		.get(function(req, res){

		if(!req.user) {
			res.send(null);
		} else {
			var psicologo = new Psicologo();
			var promise = psicologo.findOne(req.user._id);
			promise.then(
				function(data){
					res.send(data);
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}
	});


	app.route('/psicologos/:id')
	/* Obtiene al psicologo indicado por parametros */
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
	/* Filtra los psicologos mediante los datos del psicologo especificado por parametros */
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

	app.route('/psicologos/cierre')
	/* Cierra la sesion del psicologo que tiene iniciada la sesion */
		.post(passportConfig.estaAutenticado, function(req, res){
		req.session.destroy(function (err) {
			req.logout("Logout exitoso");
			if(err) {
				console.log("Error al cerrar")
			} else {
				console.log("cierro");
				res.redirect(''); //Inside a callback… bulletproof!
			}

		});
	});

	app.route('/psicologos/registro')
	/* Registra e inicia la sesion del psicologo especificado por parametros */
		.post(function(req, res, next){
		//        Como configurar correctamente el correo
		//        https://deivijt.com/blog/como-enviar-emails-con-nodejs-y-nodemailer/
		//		https://thepandeysoni.org/2016/06/12/nodemailer-service-in-node.js-using-SMTP-and-xoauth2/

		console.log(req.body);

		/* Para enviar un email, se define un transporter con los datos de la cuenta de correo */
		var transporter = nodemailer.createTransport(smtpTransport ({
			service: 'Gmail',
			auth: {
				XOAuth2 : {
					user: 'raquelgilmartinez@gmail.com',
					clientId : '442863221585-ejbe12e4ugj9jl88ra35j47n5os5vurr.apps.googleusercontent.com',
					clientSecret : 'LmH3y_Rpelz1qJr1jgA66VHV',
					refreshToken : '1/qvmdrOBCf2CzgCygn5Rs7Jd_mPdL5Rvs-TQBykc-Ju8'	
				}
			},
			//			host: host,    //my email host
			secureConnection: true,
			port: 587,
			tls: {
				rejectUnauthorized: false
			},
		}));   
		//		var transporter = nodemailer.createTransport({
		//			service: 'Gmail',
		//			auth: {
		//				XOAuth2 : {
		//					user: 'raquelgilmartinez@gmail.com',
		//					clientId : '442863221585-ejbe12e4ugj9jl88ra35j47n5os5vurr.apps.googleusercontent.com',
		//					clientSecret : 'LmH3y_Rpelz1qJr1jgA66VHV',
		//					refreshToken : '1/qvmdrOBCf2CzgCygn5Rs7Jd_mPdL5Rvs-TQBykc-Ju8'	
		//				}
		//			}
		//		});

		/* Se define el mail que vamos a enviar */
		var mailOptions = {
			from: 'raquelgilmartinez@gmail.com',
			to: 'raquelgilmartinez@gmail.com',
			subject: 'Emozio Web - Nuevo psicologo',
			html: '<h2> Nombre: <h2><p><br>' + req.body.nombre +' <p><br>' + 
			'<h2> Edad: <h2><p>' +
			req.body.edad +' <p><br>' +
			'<h2> E-mail: <h2><p><br>' +
			req.body.email +' <p><br>' +
			'<h2> Localización: <h2><p><br>' +
			req.body.localizacion +' <p><br>' +
			'<h2> Teléfono: <h2><p><br>' +
			req.body.telefono +' <p><br>' +
			'<h2> Número de colegiado: <h2><p><br>' +
			req.body.ncolegiado +' <p><br>' +
			'<h2> Experiencia profesional: <h2><p><br>' +
			req.body.experiencia +' <p><br>' +
			'<h2> Formación académica: <h2><p><br>' +
			req.body.formacion +' <p><br>' +
			'<h2> Terapias que realiza: <h2><p><br>' +
			req.body.terapias +' <p><br>' +
			'<h2> Patologias: <h2><p><br>' +
			req.body.patologias +' <p><br>' +
			'<h2> Especialidad: <h2><p><br>' +
			req.body.especialidad +' <p>'
			//            text: JSON.stringify(req.body)
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

	app.route('/psicologos/baja')
	/* Da de baja y cierra la sesion del psicologo que tiene iniciada la sesion */
		.post(function(req, res){
		var psicologo = new Psicologo();
		var promise = psicologo.darBaja(req.user._id);
		promise.then(
			function(){
				console.log("Elimino la cuenta");
				req.session.destroy(function (err) {
					req.logout("Logout exitoso");
					if(err) {
						console.log("Error al cerrar")
					} else {
						console.log("Cierro la sesion");
						res.redirect('inicio'); //Inside a callback… bulletproof!
					}

				});
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/psicologos/comentarios')
	/* Guarda los comentarios y respuestas del psicologo que tiene iniciada la sesion*/
		.put(function(req, res){
		var psicologo = new Psicologo();
		var promise = psicologo.updateComentarios(req.body);
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