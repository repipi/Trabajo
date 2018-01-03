var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var mensajeSchema = new Schema(
	{
		_id : ObjectId,
		_idPaciente : {type: ObjectId, unique: true, required: true },
		_idPsicologo : {type: ObjectId, unique: true, required: true },
		acepta : {type: Boolean, required: true },
		rechaza : {type: Boolean, required: true },
		mensajePaciente : {
			fecha : {type: String, required: true },
			fechaCita : {type: String, required: true },
			comentario : {type: String, required: true }
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

//		FECHAS
//		http://www.baluart.net/articulo/formatear-validar-y-comparar-fechas-con-javascript-momentjs
		
		/*Se crea un objeto mensaje con los datos pasados por argumento*/
		var mensaje = {
			_id : new ObjectId(),
			_idPaciente : paciente._id,
			_idPsicologo : mensaje._idPsicologo,
			acepta : false,
			rechaza : false,
			mensajePaciente : {
				fecha : "hoy",
				fechaCita : mensajePaciente.fecha,
				comentario : mensajePaciente.comentario
			}
		}
		
		console.log(mensaje);

//		Mensaje.insert(mensaje).exec(function(error, results){
//			if(error){
//				console.log("Mensajes - Error en crearMensajePaciente");
//				reject({error: error});
//			}else{
//				resolve(results);
//			}
//		});
	});
};

/* Funcion que actualiza el hilo con el mensaje de respuesta del psicologo */
mensajeSchema.methods.crearMensajePsicologo = function(mensajePsicologo, paciente, psicologo) {
	return new Promise(function(resolve, reject){

		var query = {
			_idPaciente : paciente._id,
			_idPsicologo : psicologo._id
		}

		var mensaje = {
			acepta : mensajePsicologo.acepta,
			rechaza : mensajePsicologo.rechaza,
			mensajePsicologo : {
				fecha : "hoy",
				fechaCita : mensajePsicologo.fecha,
				comentario : mensajePsicologo.comentario
			}
		}

		Mensaje.findOneAndUpdate(query, mensaje).exec(function(error, results){
			if(error){
				console.log("Mensajes - Error en crearMensajePsicologo");
				reject({error: error});
			}else{
				resolve(results);
			}
		});
	});
};

var Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;