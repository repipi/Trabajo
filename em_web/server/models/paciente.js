var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');

/* pacienteSchema representa la informacion y propiedades contenidas dentro de un objeto de tipo paciente */
/* unique: Se trata de uno solo;
   lowercase: Se almacena en minusculas;
   required: Es obligatorio que el paciente posea este atributo */
var pacienteSchema = new Schema(
	{
		_id : {type: ObjectId, unique: true, required: true },
		nombre : {type: String, required: true },
		email : {type: String, unique: true, lowercase: true, required: true },
		password : {type: String, required: true },
		genero : {type: String, required: true },
		edad : {type: String, required: true },
		localizacion: {type: String, required: true },
		telefono : {type: Number, required: true },
		diagnostico : [],
		psicologos : []
	},
	{ 
		collection: 'pacientes',
		timestamp: true /* Muestra unas propiedades que indican cuando el paciente fue creado y actualizado */
	}
);

/* Metodo que verifique una contraseña */
pacienteSchema.methods.compararPassword = function(password, cb){
	/* Comprobar una contraseña con su hash */
	bcrypt.compare(password, this.password, function(error, sonIguales){
		if(error){
			return cb(error);
		} 
		cb(null, sonIguales);
	})
};

/* Metodo que devuelve a un paciente mediante su id */
pacienteSchema.methods.findOne = function(id) {
	return new Promise(function(resolve, reject){
		/* Consulta sobre el documento */
		var query = {_id: new mongoose.Types.ObjectId(id)};

		/* Devuelve un array con todos los documentos de la coleccion Pacientes que cumplen la consulta */
		Paciente.find(query).exec(function(error, results){
			if(error){
				console.log("Pacientes - Error en findOne "+error);
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Metodo que da de alta a un paciente */
pacienteSchema.methods.darAlta = function(paciente) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {email: paciente.email};

		var datosUsuario = {}; /* Se crea un JSON datosUsuario con los datos pasados por argumento */

		/* Se genera la salt y el hash en funciones separadas */
		bcrypt.genSalt(10, function(error, salt){
			if(error) {
				console.log("Error en la sal");
			}
			bcrypt.hash(paciente.password, salt, null, function(error, hash){
				if(error) {
					console.log("Error en el hash");
				} 

				datosUsuario = {
					email: paciente.email,
					/* Obtenemos la contraseña generada en nuestro hash */
					password: hash,
					localizacion: paciente.localizacion,
					psicologos:	[],
					diagnostico : [],
					genero : paciente.genero,
					edad : paciente.edad,
					telefono : paciente.telefono
				}
			});
		});

		/* Especificacion de opciones */
		var options = {
			upsert: true, /* Si no existe, se crea un nuevo documento */
			returnOriginal: false /* No devuelve el documento que ha sido modificado */
		}

		/* Busca un documento en la coleccion de pacientes que coincida con la consulta */
		Paciente.findOne(query).count().exec(function(error, results){
			if(error){
				console.log("Pacientes - Error en darAlta");
				reject({error: error});
			}

			/* Si no se ha encontrado ningun documento igual */
			if(results == 0){
				/* Se crea un documento con los datos de usuario proporcionados por parametros */
				Paciente.update(query, datosUsuario, options).exec(function(error, results){
					if(error){
						console.log("Pacientes - Error en darAlta");
						reject({error: error});
					}else{
						resolve(results);
					}
				});
			} else {
				resolve("Ya existe");
			}
		});

	});
};

/* Metodo que actualiza los datos de un paciente */
pacienteSchema.methods.update = function(paciente) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {
			_id: paciente._id
		}

		/* Se crea un JSON datosUsuario con los datos pasados por argumento */
		var datosUsuario = {
			$set: { /* Reemplaza el valor de un campo por el valor especificado */
				email: paciente.email,
				password: paciente.password,
				localizacion: paciente.localizacion,
				psicologos:
				paciente.psicologos,
				diagnostico : paciente.diagnostico,
				genero : paciente.genero,
				edad : paciente.edad
			}
		}

		/* Busca un documento que cumpla la consulta y lo actualiza con los datos de usuario pasados por parametros */
		Paciente.findOneAndUpdate(query, datosUsuario).exec(function(error, results){
			if(error){
				console.log("Pacientes - Error en update");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Metodo que cambia la contraeña de un paciente */
pacienteSchema.methods.cambiarPassword = function(paciente) {
	return new Promise(function(resolve, reject){
		/* Comprobar una contraseña con su hash */
		bcrypt.compare(paciente.passwordActual, paciente.password, function(error, sonIguales){
			if(error){
				console.log("No es la misma");
			} 

			/* Si las contraseñas son iguales */
			if(sonIguales){

				//				console.log("son iguales");

				/* Se crea un JSON datosUsuario con los datos pasados por argumento */
				var datosUsuario = {};

				bcrypt.genSalt(10, function(error, salt){
					if(error) {
						console.log("Error en la sal");
					}
					bcrypt.hash(paciente.passwordNueva, salt, null, function(error, hash){
						if(error) {
							console.log("Error en el hash");
						} 

						datosUsuario.password=hash;

						/* Consulta sobre el documento */
						var query = {
							_id: paciente._id
						}

						/* Busca un documento que cumpla la consulta y lo actualiza con los datos de usuario pasados por parametros */
						Paciente.findOneAndUpdate(query, datosUsuario).exec(function(error, results){
							if(error){
								console.log("Pacientes - Error en update");
								reject({error: error});
							}else{
								resolve(results);
							}
						});

					});
				});
			} else {
				console.log("La contraseña no es valida");
			}
		});

	});
};

/* Metodo que devuelve el diagnostico de un paciente */
pacienteSchema.methods.findDiagnostico = function(id) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {_id: new mongoose.Types.ObjectId(id)};
		/* Se especifica la proyeccion que se quiere obtener. Los campos indicados con 0s no se devuelven */
		var projection = {
			"_id":0,
			"email":0,
			"password":0,
			"localizacion":0,
			"telefono":0,
			"psicologos":0,
			"genero":0,
			"edad":0
		};

		/* Devuelve el primer documento de la coleccion Pacientes que cumplen la consulta */
		Paciente.find(query, projection).exec(function(error, results){       
			if(error){
				console.log("Patologia - Error en findDiagnostico");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Metodo que da de baja a un paciente */
pacienteSchema.methods.darBaja = function(id) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {_id: new mongoose.Types.ObjectId(id)};

		/* Devuelve el primer documento de la coleccion Pacientes que cumplen la consulta. Posteriormente, lo borra. */
		Paciente.findOne(query).remove(function(error, results){    
			if(error){
				console.log("Paciente - Error en darBaja");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Metodo que devuelve los psicologos asociados a un paciente */
pacienteSchema.methods.findPsicologos = function(id) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {_id: new mongoose.Types.ObjectId(id)};

		/* Se especifica la proyeccion que se quiere obtener. Los campos indicados con 0s no se devuelven */
		var projection = {
			"_id":0,
			"email":0,
			"password":0,
			"localizacion":0,
			"telefono":0,
			"diagnostico":0,
			"genero":0,
			"edad":0
		};

		/* Devuelve un array con todos los documentos de la coleccion Pacientes que cumplen la consulta */
		Paciente.find(query, projection).exec(function(error, results){       
			if(error){
				console.log("Patologia - Error en findDiagnostico");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/*  Mongoose automatically looks for the plural version of your model name */
var Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;