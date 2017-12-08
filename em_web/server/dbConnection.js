//var mongo = require('mongodb');
//var mongoClient = mongo.MongoClient;
//
//exports.connect = function() {
//    if(mongo.DB) { 
//        return mongo.DB
//    }
//   
//   /* Conexion con la BBDD Emozio */ 
//    mongoClient.connect('mongodb://localhost:27017/emozio', function(err, db) {
//        if(err){
//            console.log("BBDD - Fallo de conexion");
//            process.exit(1)
//        }else{
//            console.log("BBDD - Conectado con exito")
//            mongo.DB = db
//        }
//    });
//}
