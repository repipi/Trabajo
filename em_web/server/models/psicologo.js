var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');

/* Schema del objeto Psicologo */
var psicologoSchema = new Schema(
	{
		_id :  {type: ObjectId, unique: true, required: true },
		nombre: {type: String, required: true },
		genero : {type: String, required: true },
		edad: {type: String, required: true },
		email : {type: String, unique: true, lowercase: true, required: true },
		password : {type: String, required: true },
		localizacion: {type: String, required: true },
		telefono : {type: Number, required: true },
		tipo : {type: String, required: true },
		ncolegiado : {type: String, required: true },
		experiencia : {type: String, required: true },
		formacion : {type: String, required: true },
		terapia : {type: String, required: true },
		especialidad : {type: String, required: true },
		patologias : [],
		aseguradora : {type: String, required: true },
		consulta: {
			online : Boolean,
			presencial : Boolean
		},
		comentarios : []
	},
	{ 
		collection: 'psicologos' 
	}
);

/* Metodo que verifique una contraseña */
psicologoSchema.methods.compararPassword = function(password, cb){
	/* Comprobar una contraseña con su hash */
	bcrypt.compare(password, this.password, function(error, sonIguales){
		if(error){
			return cb(error);
		} 
		cb(null, sonIguales);
	})
};

/* Metodo que devuelve a todos los psicologos */
psicologoSchema.methods.findAll = function() {
	return new Promise(function(resolve, reject){
		/* Devuelve un array con todos los documentos de la coleccion Psicologos */
		Psicologo.find().exec(function(error, results){
			if(error){
				console.log("Psicologos - Error en findAll");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Metodo que da de baja a un psicologo */
psicologoSchema.methods.darBaja = function(id) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {_id: new mongoose.Types.ObjectId(id)};

		/* Devuelve el primer documento de la coleccion Psicologos que cumplen la consulta. Posteriormente, lo borra. */
		Psicologo.findOne(query).remove(function(error, results) {    
			if(error){
				console.log("Psicologo - Error en darBaja");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Metodo que devuelve a un psicologo mediante su id */
psicologoSchema.methods.findOne = function(id) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {_id: new mongoose.Types.ObjectId(id)};

		/* Devuelve un array con todos los documentos de la coleccion Psicologos que cumplen la consulta */
		Psicologo.find(query).exec(function(error, results){
			if(error){
				console.log("Psicologos - Error en findOne "+error);
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Metodo que actualiza los datos de un psicologo */
psicologoSchema.methods.update = function(psicologo) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {
			_id: psicologo._id
		}

		/* Se crea un JSON datosUsuario con los datos pasados por argumento */
		var datosUsuario = {
			$set: { /* Reemplaza el valor de un campo por el valor especificado */
				estrellas: psicologo.estrellas
			}
		}

		/* Especificacion de opciones */
		var options = {
			upsert: true, /* Si no existe, se crea un nuevo documento */
			returnOriginal: false /* No devuelve el documento que ha sido modificado */
		}
		
		console.log(datosUsuario);

		/* Busca un documento que cumpla la consulta y lo actualiza con los datos de usuario pasados por parametros */
		Psicologo.findOneAndUpdate(query, datosUsuario, options).exec(function(error, results){
			if(error){
				console.log("Psicologo - Error en update");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Metodo que devuelve los psicologos que se corresponden con la informacion pasada por parametros */
psicologoSchema.methods.filtrar = function(psicologo){
	return new Promise(function(resolve, reject){
		var query = {}; 	/* Consulta sobre el documento */

		var precio, consulta, seguro; /* Campos a filtrar */

		/* Se formatean los rangos de precios */
		if (psicologo.precio==30) {
			precio={ $lte : 30 };
		} else if (psicologo.precio==50) {
			precio={ $gte : 30, $lte: 50};
		} else if (psicologo.precio==70) {
			precio={ $gte : 50, $lte: 70};
		} else if (psicologo.precio==90) {
			precio={ $gte : 70};
		} else if (psicologo.precio=="" || psicologo.precio==null){
			precio = { $exists: true };
		}

		/* Se formatea el seguro */
		if(psicologo.seguro=="" || psicologo.seguro==null){
			seguro = { $exists: true };
		} else {
			seguro = psicologo.seguro;
		}

		/* Se formatea la consulta y se define la query en base al tipo de consulta */
		if(psicologo.consulta=="" || psicologo.consulta==null){
			query = {
				consulta: { $exists: true },
				precio : precio,
				aseguradora : seguro
			};
		} else if (psicologo.consulta=="presencial") {
			query = {
				$and : [ 
					{$or: [{consulta: { online: false, presencial: true }}, {consulta: {online: true, presencial:true}}]},
					{precio : precio},
					{aseguradora : seguro}
				]};
		} else if (psicologo.consulta=="online") {
			query = {
				$and : [
					{$or: [{consulta: { online: true, presencial: false }}, {consulta: {online: true, presencial:true}}]},
					{precio : precio},
					{aseguradora : seguro}
				]};
		}

		console.log(psicologo);
		console.log(JSON.stringify(query));

		/* Devuelve un array con todos los documentos de la coleccion Psicologos que cumplen la consulta */
		Psicologo.find(query).exec(function(error, results){
			if(error){
				console.log("Psicologos - Error en filtrar "+error);
				reject({error: error});
			}else{
				resolve(results);
				console.log(results);
			}
		});
	});
};

/* Metodo para añadir comentarios al psicologo */
psicologoSchema.methods.updateComentarios = function(psicologo) {
	return new Promise(function(resolve, reject){

		/* Consulta sobre el documento */
		var query = {
			_id: psicologo._id
		}

		/* Se crea un JSON datosComentarios con los datos pasados por argumento */
		var datosComentarios = {
			comentarios: psicologo.comentarios,
			estrellas: psicologo.estrellas
		}

		/* Busca un documento que cumpla la consulta y lo actualiza con los datos de usuario pasados por parametros */
		Psicologo.findOneAndUpdate(query, datosComentarios).exec(function(error, results){
			if(error){
				console.log("Pacientes - Error en updateComentarios");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

var Psicologo = mongoose.model('Psicologo', psicologoSchema);

module.exports = Psicologo;