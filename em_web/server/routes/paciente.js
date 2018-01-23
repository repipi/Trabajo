var Paciente = require('../models/paciente');
var passport = require('passport');
var passportConfig = require('../config/passport');

module.exports = function(app) {


	app.route('/pacientes')
	/* Actualiza los datos del paciente especificado por parametros */
		.put(function(req, res) {
		setTimeout(function(){
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
		}, 50);
	})

	/* Obtiene al paciente que ha iniciado la sesion */
		.get(function(req, res){
		setTimeout(function(){
			if(!req.user) {
				res.send(null);
			} else {
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
			}
		}, 50);
	});

	app.route('/pacientes/changePassword')
	/* Cambia la contraseña del paciente especificado por parametros */
		.put(function(req, res){
		setTimeout(function(){
			var paciente = new Paciente();
			var promise = paciente.cambiarPassword(req.body);
			promise.then(
				function(data){
					res.send(data);
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}, 50);
	});

	app.route('/pacientes/registro')
	/* Registra e inicia la sesion del paciente especificado por parametros */
		.post(function(req, res, next){
		setTimeout(function(){
			var paciente = new Paciente();
			var promise = paciente.darAlta(req.body, next);
			promise.then(function(){
				passport.authenticate('local', function(error, paciente, info){
					if(error){
						return next(error);
					}
					/* Si no encontramos al paciente en la BBDD */
					if(!paciente) {
						return res.status(400).send('Email o contraseña no validos');
					}else{
						req.login(paciente, {}, function(err) {
							if (err) { 
								//							return next(err) 
								return null;
							};
							return res.json(paciente);
						});
					}
				})(req, res, next); //Funcion que devuelve passport y que debe ser invocada de esta forma
			});
		}, 50);
	});

	app.route('/pacientes/acceso')
	/* Inicia la sesion del usuario especificado por parametros */
		.post(function(req, res, next){
		
		setTimeout(function(){
			passport.authenticate('local', function(error, paciente, info){
				if(error){
					return next(error);
				}
				/* Si no encontramos al paciente en la BBDD */
				if(!paciente) {
					//				return res.status(400).send('Email o contraseña no validos');
					return null;
				}else{
					req.login(paciente, {}, function(err) {
						if (err) { 
							//						return next(err) 
							return null;
						};
						//					console.log("aqui");
						return res.json(paciente);
					});
				}
			})(req, res, next); //Funcion que devuelve passport y que debe ser invocada de esta forma
		}, 50);
	});

	app.route('/pacientes/cierre')
	/* Cierra la sesion del paciente que tiene iniciada la sesion */
		.post(passportConfig.estaAutenticado, function(req, res){
		setTimeout(function(){
			req.session.destroy(function (err) {
				req.logout("Logout exitoso");
				if(err) {
					console.log("Error al cerrar")
				} else {
					console.log("Cierro la sesion");
				}

			});
		}, 50);
	});

	app.route('/pacientes/diagnostico')
	/* Obtiene el diagnostico del paciente que tiene iniciada la sesion */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/pacientes/baja')
	/* Da de baja y cierra la sesion del paciente que tiene iniciada la sesion */
		.post(function(req, res){
		setTimeout(function(){
			var paciente = new Paciente();
			var promise = paciente.darBaja(req.user._id);
			promise.then(
				function(){
					console.log("Elimino la cuenta");
					req.session.destroy(function (err) {
						req.logout("Logout exitoso");
						if(err) {
							console.log("Error al cerrar")
						} else {
							console.log("Cierro la sesion");
						}
					});
				},
				function (error){
					res.status(500).send({error: error});
				}
			);
		}, 50);
	});

	app.route('/pacientes/psicologos')
	/* Obtiene los psicologos asociados al paciente que tiene iniciada la sesion */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

};