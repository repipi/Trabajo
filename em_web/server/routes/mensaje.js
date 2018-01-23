var Mensaje = require('../models/mensaje')

module.exports = function(app) {

	app.route('/mensajes/crearMensajePaciente')
	/* Guarda el mensaje enviado por un paciente a un psicologo */
		.post(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/mensajes/crearMensajePsicologo')
	/* Guarda el mensaje enviado por un psicologo a un paciente */
		.post(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/mensajes/verMsjPendPsico')
	/* Obtiene los mensajes pendientes de responder por un psicologo */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/mensajes/verMsjAceptPsico')
	/* Obtiene los hilos de mensajes aceptados por un psicologo */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/mensajes/verMsjRechPsico')
	/* Obtiene los hilos de mensajes rechazados por un psicologo */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/mensajes/verMsjPendPac')
	/* Obtiene los mensajes pendientes de responder por psicologos escritos por el paciente */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/mensajes/verMsjAceptPac')
	/* Obtiene los hilos de mensajes aceptados por psicologos pertenecientes al paciente */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/mensajes/verMsjRechPac')
	/* Obtiene los hilos de mensajes rechazados por psicologos pertenecientes al paciente */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});

	app.route('/mensajes/verMsjPacientes')
	/* Obtiene todos los mensajes de un paciente */
		.get(function(req, res){
		setTimeout(function(){
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
		}, 50);
	});
};
