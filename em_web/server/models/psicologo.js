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
        aseguradora : String,
        consulta: {
            online : Boolean,
            presencial : Boolean
        }
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

psicologoSchema.methods.filtrar = function(psicologo){
    return new Promise(function(resolve, reject){
        var equivalencia = "";

        if (psicologo.precio==30) {
            equivalencia=JSON.parse('{ "$lt" : '+psicologo.precio+'}');
        } else if (psicologo.precio==50 || psicologo.precio==70) {
            equivalencia=JSON.parse('{ "$gt" : '+psicologo.precio-20+', "$lt": '+psicologo.precio+'}');
        } else if (psicologo.precio==90) {
            equivalencia=JSON.parse('{ "$gt" : '+psicologo.precio-20+'}');
        } else if (psicologo.precio=="Cualquiera"){
            equivalencia="";
        }
        
        if(psicologo.seguro=="Cualquiera"){
            psicologo.seguro="";
        }

        var query = { 
            $or: [
                {consulta : psicologo.consulta},
                {precio : equivalencia},
                {seguro : psicologo.seguro}
            ]
        };

        console.log(query);
        
        Psicologo.find(query).exec(function(error, results){
            if(error){
                console.log("Psicologos - Error en filtrar "+error);
                reject({error: error});
            }else{
                resolve(results);
                //console.log(results);
            }
        });
    });
};

var Psicologo = mongoose.model('Psicologo', psicologoSchema);

module.exports = Psicologo;