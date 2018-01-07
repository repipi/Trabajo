var Mensaje = require('../models/mensaje')

module.exports = function(app) {

	app.route('/mensajes/crearMensajePaciente')
	/* Guarda el mensaje enviado por un paciente a un psicologo */
		.post(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.crearMensajePaciente(req.body, req.user);
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/crearMensajePsicologo')
	/* Guarda el mensaje enviado por un psicologo a un paciente */
		.post(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.crearMensajePsicologo(req.body);
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/verMsjPendPsico')
		.get(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.findMsgPsicoPend(req.user);
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/verMsjAceptPsico')
		.get(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.findMsgPsicoAcepta(req.user);
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/verMsjRechPsico')
		.get(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.findMsgPsicoRech(req.user);
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/verMsjPendPac')
		.get(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.findMsgPacPend(req.user);
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/verMsjAceptPac')
		.get(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.findMsgPacAcepta(req.user);
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/verMsjRechPac')
		.get(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.findMsgPacRech(req.user);
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/verMsjPacientes')
		.get(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.findMsgPaciente(req.user);
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
