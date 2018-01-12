var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* Schema del objeto Patologia */
var patologiaSchema = new Schema(
    {
        _id : ObjectId,
        nombre: {type: String, required: true },
        sintomas : []
    },
    { 
        collection: 'patologias' 
    }
);

/* Metodo que devuelve a todas las patologias */
patologiaSchema.methods.findAll = function() {
    return new Promise(function(resolve, reject){
		/* Devuelve un array con todos los documentos de la coleccion Patologias */
        Patologia.find().exec(function(error, results){
            if(error){
                console.log("Patologia - Error en findAll");
                reject({error: error});
            }else{
                resolve(results);
            }
        });
    });
};

/* Metodo que devuelve a todas las preguntas de todas las patologias */
patologiaSchema.methods.findPreguntas = function() {
    return new Promise(function(resolve, reject){
        
			/* Consulta sobre el documento */
        var query = {};
		
		/* Se especifica la proyeccion que se quiere obtener. Los campos indicados con 0s no se devuelven */
        var projection = {
            "preguntas":{$slice:1}, 
            "_id":0,
            "nombre":0,
            "respuesta":0,
            "sintomas":0
        };
        
		/* Devuelve un array con todos los documentos de la coleccion Patologias que cumplen la consulta */
        Patologia.find(query, projection).exec(function(error, results){       
            if(error){
                console.log("Patologia - Error en findPreguntas");
                reject({error: error});
            }else{
                resolve(results);
            }
        });
    });
};

var Patologia = mongoose.model('Patologia', patologiaSchema);

module.exports = Patologia;