var Mensaje = require('../models/mensaje')

module.exports = function(app) {

	app.route('/mensajes')
	/* Obtiene mensajes */
		.get(function(req, res){

		var mensaje = new Mensaje();
		var promise = mensaje.findAll();
		promise.then(
			function(data){
				res.send(data);
			},
			function (error){
				res.status(500).send({error: error});
			}
		);
	});

	app.route('/mensajes/mensajePaciente')
	/* Guarda el mensaje enviado por un paciente a un psicologo */
		.post(function(req, res){

		console.log("holaaa");
		var mensaje = new Mensaje();
		var promise = mensaje.crearMensajePaciente(mensaje, req.user);
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
