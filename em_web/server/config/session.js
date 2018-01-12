/* Al combinar la session con MongoStore se crea automaticamente una coleccion de sesiones */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

var MONGO_URL = 'mongodb://localhost:27017/emozio';

module.exports = function(app) {
	//Utiliza el middleware Session
	app.use(session({
		/* El algoritmo de criptografia utilizado utiliza esta propiedad como salt para encriptar */
		secret: 'ESTO ES SECRETO',
		/* Por cada llamada realizada al servidor, la sesion se guardara en la BBDD */
		resave: true,
		/* Cuando se realiza la llamada por primera vez, guarda un objeto vacio con informacion de esa session */
		saveUninitialized: true,
		store: new MongoStore({
			url: MONGO_URL,
			/* autoReconnect: Si sucede un error, trata de volver a conectarse */
			autoReconnect: true
		})
	}));

	/* Inicializa passport */
	app.use(passport.initialize());
	/* Utiliza las sesiones de passport */
	app.use(passport.session());
}