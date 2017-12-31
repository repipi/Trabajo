var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');

var psicologoSchema = new Schema(
	{
		_id : ObjectId,
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
		}
	},
	{ 
		collection: 'psicologos' 
	}
);

psicologoSchema.methods.compararPassword = function(password, cb){
	bcrypt.compare(password, this.password, function(error, sonIguales){
		if(error){
			return cb(error);
		} 
		cb(null, sonIguales);
	})
};

psicologoSchema.methods.autenticar = function(paciente) {
	return new Promise(function(resolve, reject){

		var query = {
			email: paciente.email,
			password: paciente.password
		}

		Psicologo.find(query).exec(function(error, results){
			if(error){
				console.log("Psicologos - Error en autenticar");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

psicologoSchema.methods.findAll = function() {
	return new Promise(function(resolve, reject){
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

psicologoSchema.methods.darBaja = function(id) {
	return new Promise(function(resolve, reject){

		var query = {_id: new mongoose.Types.ObjectId(id)};

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

psicologoSchema.methods.findOne = function(id) {
	return new Promise(function(resolve, reject){
		var query = {_id: new mongoose.Types.ObjectId(id)};

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

psicologoSchema.methods.filtrar = function(psicologo){
	return new Promise(function(resolve, reject){
		var query = {};

		var precio, consulta, seguro;

		console.log(psicologo);

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

		console.log(seguro);

		if(psicologo.seguro=="" || psicologo.seguro==null){
			seguro = { $exists: true };
		} else {
			seguro = psicologo.seguro;
		}

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

		//        console.log(JSON.stringify(consulta));
		//        console.log(JSON.stringify(precio));
		//        console.log(JSON.stringify(seguro));

		console.log(JSON.stringify(query));

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

var Psicologo = mongoose.model('Psicologo', psicologoSchema);

module.exports = Psicologo;