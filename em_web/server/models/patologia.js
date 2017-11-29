//var mongo = require('mongodb');
var mongoose = require('mongoose');

module.exports = {
    /* Devuelve la variable preguntas */
    all: function() {
        var collection = mongo.DB.collection('patologias');

        collection.find({}).toArray(function(err, docs){
            console.log("Patologias - Error en all: "+err+"\n"+docs);
        });
    }
}