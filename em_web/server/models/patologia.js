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

var Patologia = mongoose.model('Patologia', patologiaSchema);

module.exports = Patologia;

////var mongo = require('mongodb');
//var mongoose = require('mongoose');
//
//module.exports = {
//    /* Devuelve la variable preguntas */
//    all: function() {
//        var collection = mongo.DB.collection('patologias');
//
//        collection.find({}).toArray(function(err, docs){
//            console.log("Patologias - Error en all: "+err+"\n"+docs);
//        });
//    }
//}