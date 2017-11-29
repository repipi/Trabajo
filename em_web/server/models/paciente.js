var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var pacienteSchema = new Schema(
    {
        //_id : ObjectId,
        email : String,
        password : String,
        localizacion: String,
        telefono : Number,
        //sintomas : [],
        //patologia : [],
        //psicologos : []
    },
    { 
        collection: 'pacientes' 
    }
);

//pacienteSchema.methods.findAll = function(req, res) {
//    var promise = Paciente.find().exec();
//
//    promise
//        .then(function(pacientes) {
//        res.send(pacientes);
//    })
//        .then(function(pacientes) {
//        console.log('FindAll pacientes: ' + pacientes);
//        // do something with updated user
//    })
//        .catch(function(err){
//        // just need one of these
//        res.status(500).send('error FindAll:', err);
//    });
//};

pacienteSchema.methods.findAll = function(req, res) {
    return new Promise(function(resolve, reject){
        Paciente.find().exec(function(error, results){
            if(error){
                reject({error: error});
            }else{
                resolve(results);
            }
        });
    });
};

/*  Mongoose automatically looks for the plural version of your model name */
var Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;


//var mongo = require('mongodb');
//
//module.exports = {
//
//    /* Funcion get que devuelve a un paciente mediante su email */
//    get: function(_id) {
//        var collection = mongo.DB.collection('pacientes');
//
//        var query = {_id: _id};
//        collection.find(query).toArray(function(err, docs){
//            console.log("Pacientes - Error en get: "+err+"\n"+docs);
//        });
//    },
//
//    /* Funcion all que devuelve a todos los pacientes */
//    all: function() {
//        var collection = mongo.DB.collection('pacientes');
//
//        collection.find({}).toArray(function(err, docs){
//            if(docs.length === 0 || err){
//                console.log("Pacientes - Error en all: "+err+"\n"+docs);
//            }
//        });
//    },
//
//    /* Funcion update que actualiza los datos de un paciente */
//    update: function(paciente) {
//        var collection = mongo.DB.collection('pacientes');
//
//        var query = {
//            _id: paciente._id
//        };
//
//        var datosUsuario = {
//            /* setOnInsert evita insertar innecesariamente, en el caso de que los datos sean los mismos */
//            $setOnInsert: {
//                email: paciente.email,
//                password: paciente.password,
//                localizacion: paciente.localizacion,
//                sintomas: paciente.sintomas,
//                patologia: paciente.patologia,
//                psicologos:
//                paciente.psicologos
//            }
//        }
//
//        collection.findOneAndUpdate(query, datosUsuario, function(err, docs){
//            console.log("Pacientes - Error en update: "+err+"\n"+docs);
//        });
//
//    },
//
//    /* Funcion que crea un nuevo paciente */
//    create: function(paciente) {
//        var collection = mongo.DB.collection('pacientes');
//
//        var datosUsuario = {
//            email: paciente.email,
//            password: paciente.password,
//            localizacion: paciente.localizacion,
//            sintomas: paciente.sintomas,
//            patologia: paciente.patologia,
//            psicologos:
//            paciente.psicologos
//        }
//
//        collection.insert(datosUsuario, function(err, docs){
//            console.log("Pacientes - Error en create: "+err+"\n"+docs);
//        });
//    },
//
//    autenticar: function(paciente) {
//        var collection = mongo.DB.collection('pacientes');
//
//        var query = {
//            email: "rgm@gmail.com",
//            password: "1234"
//        }
//
//        var result= collection.find(query, function(err, docs){
//            console.log("Pacientes - Error en autenticar: "+err);
//        });
//    }
//}
