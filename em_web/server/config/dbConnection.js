var mongoose = require('mongoose');

module.exports = function() {
	var MONGO_URL = 'mongodb://localhost:27017/emozio';
	
	var options = {
		useMongoClient: true,
		autoIndex: false, // No crear index
		reconnectTries: Number.MAX_VALUE, // Nunca para de reintentar conectarse
		reconnectInterval: 500, // Reconexion cada 500ms
		poolSize: 10, // Mantener una conexion de 10 sockets
		// Si no se conecta, devuelve un error inmediatamente antes de tratar de reconectarse
		bufferMaxEntries: 0
	};

	/* Se determina que Mongoose utilice las mismas promise que NodeJS */
	mongoose.Promise = global.Promise;

	// Se conecta la BBDD
	mongoose.connect(MONGO_URL, options, function(err, res) {
		if(err) {
			console.log('ERROR: Reconectando a la BBDD. ' + err);
		}else{
			console.log("Conectado a la BBDD");
		}
	});

	var db = mongoose.connection;
	/* Si sucede un error, mostrarlo */
	db.on('error', console.error.bind(console, 'Error de conexion:'));
	db.once('open', function() {
		console.log("Con exito");
	});
}
