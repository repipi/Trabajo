var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var preguntasSchema = new Schema(
    {
        _id : ObjectId,
        preguntas : []
    },
    { 
        collection: 'preguntas' 
    }
);

preguntasSchema.methods.findAll = function() {
    return new Promise(function(resolve, reject){
        Preguntas.findOne().exec(function(error, results){
            if(error){
                console.log("Preguntas - Error en findAll");
                reject({error: error});
            }else{
                resolve(results);
            }
        });
    });
};

var Preguntas = mongoose.model('Preguntas', preguntasSchema);

module.exports = Preguntas;


//var mongo = require('mongodb');
//var mongoose = require('mongoose');
//
//module.exports = {
//    /* Devuelve la variable preguntas */
//    all: function() {
//        var collection = mongo.DB.collection('preguntas');
//
//        collection.find({}).toArray(function(err, docs){
//            console.log("preguntas - Error en all: "+err+"\n"+docs);
//        });
//    }
//}

