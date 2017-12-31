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
	})

	/* Obtiene un paciente */
		.get(function(req, res){
		if(!req.user) {
			res.send(null);
		} else {
			var paciente = new Paciente();
			var promise = paciente.findOne(req.user._id);
			promise.then(
				function(data){
					//					console.log("hay" + data);
					res.send(data);
				},
				function (error){
					//					console.log("error");
					res.status(500).send({error: error});
				}
			);
		}
	});

	app.route('/pacientes/changePassword')
		.put(function(req, res){
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
						if (err) { 
							//							return next(err) 
							return null;
						};
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
				//				return res.status(400).send('Email o contraseña no validos');
				//				console.log("mal");
				return null;
			}else{
				req.login(paciente, {}, function(err) {
					if (err) { 
						//						return next(err) 
						//						console.log("error");
						return null;
					};
					//					console.log("aqui");
					return res.json(paciente);
				});
			}
		})(req, res, next);//Funcion que devuelve passport y que debe ser invocada de esta forma
	});

	app.route('/pacientes/cierre')
		.post(passportConfig.estaAutenticado, function(req, res){
		req.session.destroy(function (err) {
			req.logout("Logout exitoso");
			if(err) {
				console.log("Error al cerrar")
			} else {
				console.log("Cierro la sesion");
				//res.redirect(''); //Inside a callback… bulletproof!
			}

		});
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

	app.route('/pacientes/baja')
	/* Elimina un paciente de la BBDD */
		.post(function(req, res){
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
						//res.redirect(''); //Inside a callback… bulletproof!
					}

				});
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