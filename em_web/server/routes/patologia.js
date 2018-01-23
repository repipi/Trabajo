var Patologia = require('../models/patologia')

module.exports = function(app) {

	app.route('/patologias')
	/* Obtiene todas las patologias */
		.get(function(req, res){
		setTimeout(function(){
			var patologia = new Patologia();
			var promise = patologia.findAll();
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

	app.route('/patologias/preguntas')
	/* Obtiene todas las preguntas asociadas a las patologias */
		.get(function(req, res){
		setTimeout(function(){
			var patologia = new Patologia();
			var promise = patologia.findPreguntas();
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
