var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var mensajeSchema = new Schema(
	{
		_id : ObjectId,
		paciente : {
			_id : {type: ObjectId, unique: true, required: true },
			genero : {type: String, required: true },
			edad : {type: String, required: true },
			email : {type: String, required: true },
			telefono : {type: Number, required: true },
			localizacion : {type: String, required: true },
			diagnostico : []
		},
		psicologo : {
			_id : {type: ObjectId, unique: true, required: true },
			nombre : {type: String, required: true },
			genero : {type: String, required: true },
			edad : {type: String, required: true },
			email : {type: String, required: true },
			telefono : {type: Number, required: true },
			localizacion : {type: String, required: true },
			foto : {type: String, required: true }
		},
		acepta : {type: Boolean, required: true },
		rechaza : {type: Boolean, required: true },
		mensajePaciente : {
			fecha : {type: String, required: true },
			preferencias : {type: String, required: true },
			texto : {type: String, required: true }
		},
		mensajePsicologo : {
			fecha : {type: String, required: true },
			fechaCita : {type: String, required: true },
			comentario : {type: String, required: true }
		}
	},
	{ 
		collection: 'mensajes' 
	}
);

mensajeSchema.methods.crearMensajePaciente = function(mensajePaciente, paciente) {
	return new Promise(function(resolve, reject){

		var fecha = new Date();
		var textoFecha = ("0" + fecha.getDate()).slice(-2) + "/" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "/" + fecha.getFullYear() + "; " + (fecha.getHours()<10?'0':'') + fecha.getHours() + ":" + (fecha.getMinutes()<10?'0':'') + fecha.getMinutes() + ":" + (fecha.getSeconds()<10?'0':'') + fecha.getSeconds();

		/*Se crea un objeto mensaje con los datos pasados por argumento*/
		var mensaje = { 
			paciente : {
				_id : new mongoose.Types.ObjectId(paciente._id),
				genero : paciente.genero,
				edad : paciente.edad,
				email : paciente.email,
				telefono : paciente.telefono,
				localizacion : paciente.localizacion,
				diagnostico : paciente.diagnostico
			},
			psicologo : {
				_id : new mongoose.Types.ObjectId(mensajePaciente.psicologo._id),
				nombre : mensajePaciente.psicologo.nombre,
				genero : mensajePaciente.psicologo.genero,
				edad : mensajePaciente.psicologo.edad,
				email : mensajePaciente.psicologo.email,
				telefono : mensajePaciente.psicologo.telefono,
				localizacion : mensajePaciente.psicologo.localizacion,
				foto : mensajePaciente.psicologo.foto
			},
			acepta : false,
			rechaza : false,
			mensajePaciente : {
				fecha : textoFecha,
				preferencias : mensajePaciente.preferencias,
				texto : mensajePaciente.texto
			}
		}

		var options = {
			upsert: true, //No se va a añadir un nuevo documento, en su lugar devuelve un id al controller para dar lugar a una excepcion (?)
			returnOriginal: false 
		}

		Mensaje.update(mensaje, mensaje, options).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en crearMensajePaciente");
				reject({error: error});
			}else{
				resolve(results);
			}
		});

	});
};

/* Funcion que actualiza el hilo con el mensaje de respuesta del psicologo */
mensajeSchema.methods.crearMensajePsicologo = function(mensajePsicologo) {
	return new Promise(function(resolve, reject){

		var fecha = new Date();
		var textoFecha = ("0" + fecha.getDate()).slice(-2) + "/" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "/" + fecha.getFullYear() + "; " + (fecha.getHours()<10?'0':'') + fecha.getHours() + ":" + (fecha.getMinutes()<10?'0':'') + fecha.getMinutes() + ":" + (fecha.getSeconds()<10?'0':'') + fecha.getSeconds();

		var query = {
			_id : new mongoose.Types.ObjectId(mensajePsicologo._id)
		}

		var mensaje = {
			$set: {
				acepta : mensajePsicologo.acepta,
				rechaza : mensajePsicologo.rechaza,
				mensajePsicologo : {
					fecha : textoFecha,
					fechaCita : mensajePsicologo.fechaCita,
					comentario : mensajePsicologo.texto
				}
			}
		}

		Mensaje.findOneAndUpdate(query, mensaje).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en crearMensajePsicologo: "+error);
				reject({error: error});
			}else{
				console.log(results);
				console.log("aquiii");
				resolve(results);
			}
		});
	});
};

/* Funcion que devuelve todos los mensajes pendientes de un psicologo */
mensajeSchema.methods.findMsgPsicoPend = function(psicologo) {
	return new Promise(function(resolve, reject){
		var query = {
			'psicologo._id' : new mongoose.Types.ObjectId(psicologo._id),
			acepta: false,
			rechaza: false
		};

		Mensaje.find(query).sort( { 'mensajePaciente.fecha' : -1 } ).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en findMsgPsicoPend "+error);
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Funcion que devuelve todos los mensajes aceptados de un psicologo */
mensajeSchema.methods.findMsgPsicoAcepta = function(psicologo) {
	return new Promise(function(resolve, reject){
		var query = {
			'psicologo._id' : new mongoose.Types.ObjectId(psicologo._id),
			acepta: true,
			rechaza: false
		};

		Mensaje.find(query).sort( { 'mensajePaciente.fecha' : -1 } ).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en findMsgPsicoAcepta "+error);
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Funcion que devuelve todos los mensajes rechazados de un psicologo */
mensajeSchema.methods.findMsgPsicoRech = function(psicologo) {
	return new Promise(function(resolve, reject){
		var query = {
			'psicologo._id' : new mongoose.Types.ObjectId(psicologo._id),
			acepta: false,
			rechaza: true
		};

		Mensaje.find(query).sort( { 'mensajePaciente.fecha' : -1 } ).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en findMsgPsicoRech "+error);
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Funcion que devuelve todos los mensajes pendientes de un paciente */
mensajeSchema.methods.findMsgPacPend = function(paciente) {
	return new Promise(function(resolve, reject){
		var query = {
			'paciente._id' : new mongoose.Types.ObjectId(paciente._id),
			acepta: false,
			rechaza: false
		};	

		Mensaje.find(query).sort( { 'mensajePaciente.fecha' : -1 } ).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en findMsgPacRech "+error);
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Funcion que devuelve todos los mensajes aceptados de un paciente */
mensajeSchema.methods.findMsgPacAcepta = function(paciente) {
	return new Promise(function(resolve, reject){
		var query = {
			'paciente._id' : new mongoose.Types.ObjectId(paciente._id),
			acepta: true,
			rechaza: false
		};

		Mensaje.find(query).sort( { 'mensajePaciente.fecha' : -1 } ).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en findMsgPacAcepta "+error);
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

/* Funcion que devuelve todos los mensajes rechazados de un paciente */
mensajeSchema.methods.findMsgPacRech = function(paciente) {
	return new Promise(function(resolve, reject){
		var query = {
			'paciente._id' : new mongoose.Types.ObjectId(paciente._id),
			acepta: false,
			rechaza: true};

		Mensaje.find(query).sort( { 'mensajePaciente.fecha' : -1 } ).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en findMsgPacRech "+error);
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

var Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;