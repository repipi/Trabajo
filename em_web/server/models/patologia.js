var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var patologiaSchema = new Schema(
    {
        _id : ObjectId,
        nombre: String,
        sintomas : []
    },
    { 
        collection: 'patologias' 
    }
);

patologiaSchema.methods.findAll = function() {
    return new Promise(function(resolve, reject){
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

patologiaSchema.methods.findPreguntas = function() {
    return new Promise(function(resolve, reject){
        
        var query = {};
        var projection = {
            "preguntas":{$slice:1}, 
            "_id":0,
            "nombre":0,
            "respuesta":0,
            "sintomas":0
        };
        
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