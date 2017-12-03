var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var psicologoSchema = new Schema(
    {
        _id : ObjectId,
        nombre: String,
        edad: Number,
        email : String,
        password : String,
        localizacion: String,
        telefono : Number,
        tipo : String,
        ncolegiado : String,
        experiencia : String,
        formacion : String,
        terapia : String,
        especialidad : String,
        patologias : [],
        aseguradora : String
    },
    { 
        collection: 'psicologos' 
    }
);

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

var Psicologo = mongoose.model('Psicologo', psicologoSchema);

module.exports = Psicologo;

//var mongo = require('mongodb');
//
//module.exports = {
//    /* Funcion get que devuelve un psicologo */
//    get: function(_id) {
//        var collection = mongo.DB.collection('psicologos');
//
//        var query = {_id: _id};
//        collection.find(query).toArray(function(err, docs){
//            console.log("Psicologos - Error en get: "+err+"\n"+docs);
//        });
//    },
//
//    /* Funcion all que devuelve a todos los psicologos */
//    all: function() {
//        var collection = mongo.DB.collection('psicologos');
//
//        collection.find({}).toArray(function(err, docs){
//            console.log("Psicologos - Error en all: "+err+"\n"+docs);
//        });
//    }  
//
//}