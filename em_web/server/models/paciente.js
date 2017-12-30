var mongoose = require('mongoose');
// set Promise provider to bluebird
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
		//_id : ObjectId,
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
		/* Crea unas propiedades que indican cuando el paciente fue creado y actualizado */
		timestamp: true
	}
);

pacienteSchema.methods.encriptarPassword = function(paciente) {

	/* Iteramos 10 veces */
	bcrypt.genSalt(10, function(error, salt){
		if(error) {
			console.log("Error en la sal");
		}
		bcrypt.hash(paciente.password, salt, null, function(error, hash){
			if(error) {
				console.log("Error en el hash");
			} 
			/* Obtenemos la contraseña generada en nuestro hash */
			paciente.password = hash;
		})
	})
}

pacienteSchema.methods.compararPassword = function(password, cb){
	bcrypt.compare(password, this.password, function(error, sonIguales){
		if(error){
			return cb(error);
		} 
		cb(null, sonIguales);
	})
};

/* Funcion all que devuelve a todos los pacientes */
pacienteSchema.methods.findAll = function() {
	return new Promise(function(resolve, reject){
		Paciente.find().exec(function(error, results){
			if(error){
				console.log("Pacientes - Error en findAll");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Funcion get que devuelve a un paciente mediante su id */
pacienteSchema.methods.findOne = function(id) {
	return new Promise(function(resolve, reject){
		var query = {_id: new mongoose.Types.ObjectId(id)};

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

pacienteSchema.methods.autenticar = function(paciente) {
	return new Promise(function(resolve, reject){

		var query = {
			email: paciente.email,
			password: paciente.password
		}

		Paciente.find(query).exec(function(error, results){
			if(error){
				console.log("Pacientes - Error en autenticar");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

pacienteSchema.methods.darAlta = function(paciente) {
	return new Promise(function(resolve, reject){

		var query = {email: paciente.email};

		/*Se crea un objeto datosUsuario con los datos pasados por argumento*/
		var datosUsuario = {};

		bcrypt.genSalt(10, function(error, salt){
			if(error) {
				console.log("Error en la sal");
			}
			bcrypt.hash(paciente.password, salt, null, function(error, hash){
				if(error) {
					console.log("Error en el hash");
				} 

				datosUsuario = {
					/*setOnInsert es llamado por update en el caso de que no exista exactamente el mismo documento (porque ya no hay nada que modificarle)*/
					//                    $setOnInsert: {
					email: paciente.email,
					/* Obtenemos la contraseña generada en nuestro hash */
					password: hash,
					localizacion: paciente.localizacion,
					psicologos:
					[],
					diagnostico : [],
					genero : paciente.genero,
					edad : paciente.edad
					//                    }
				}
				
				console.log(datosUsuario);
			});
		});

		var options = {
			upsert: true, //No se va a añadir un nuevo documento, en su lugar devuelve un id al controller para dar lugar a una excepcion (?)
			returnOriginal: false 
		}

		Paciente.findOne(query).count().exec(function(error, results){
			if(error){
				console.log("Pacientes - Error en darAlta");
				reject({error: error});
			}

			/* Si no se ha encontrado ningun documento igual */
			if(results == 0){
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

/* Funcion update que actualiza los datos de un paciente */
pacienteSchema.methods.update = function(paciente) {
	return new Promise(function(resolve, reject){

		var query = {
			_id: paciente._id
		}

		var datosUsuario = {
			$set: {
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

/* Funcion update que actualiza los datos de un paciente */
pacienteSchema.methods.cambiarPassword = function(paciente) {
	return new Promise(function(resolve, reject){

		bcrypt.compare(paciente.passwordActual, paciente.password, function(error, sonIguales){
			if(error){
				console.log("No es la misma");
			} 

			/* Si existe un usuario con ese correo, y las contraseñas son iguales */
			if(sonIguales){

				console.log("son iguales");

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

						var query = {
							_id: paciente._id
						}

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

pacienteSchema.methods.findDiagnostico = function(id) {
	return new Promise(function(resolve, reject){

		var query = {_id: new mongoose.Types.ObjectId(id)};
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

pacienteSchema.methods.findPsicologos = function(id) {
	return new Promise(function(resolve, reject){

		var query = {_id: new mongoose.Types.ObjectId(id)};
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