var mongo = require('mongodb');

module.exports = {
    /* Funcion get que devuelve un psicologo */
    get: function(_id) {
        var collection = mongo.DB.collection('psicologos');

        var query = {_id: _id};
        collection.find(query).toArray(function(err, docs){
            console.log("Psicologos - Error en get: "+err+"\n"+docs);
        });
    },

    /* Funcion all que devuelve a todos los psicologos */
    all: function() {
        var collection = mongo.DB.collection('psicologos');

        collection.find({}).toArray(function(err, docs){
            console.log("Psicologos - Error en all: "+err+"\n"+docs);
        });
    }  

}