var mongoose = require('mongoose');

module.exports = function() {
	var MONGO_URL = 'mongodb://localhost:27017/emozio';
	
	var options = {
		useMongoClient: true,
		autoIndex: false, // Don't build indexes
		reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
		reconnectInterval: 500, // Reconnect every 500ms
		poolSize: 10, // Maintain up to 10 socket connections
		// If not connected, return errors immediately rather than waiting for reconnect
		bufferMaxEntries: 0
	};

	/* Se determina que mongoose utilice las mismas promise que NodeJS */
	mongoose.Promise = global.Promise;

	// Se conecta la BBDD
	mongoose.connect(MONGO_URL, options, function(err, res) {
		if(err) {
			console.log('ERROR: connecting to Database. ' + err);
		}else{
			console.log("Conectado a la BBDD");
		}
	});

	var db = mongoose.connection;
	/* Si sucede un error, mostrarlo */
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		console.log("Con exito");
	});
}
