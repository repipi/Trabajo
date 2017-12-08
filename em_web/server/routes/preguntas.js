var Preguntas = require('../models/preguntas')

module.exports = function(app) {

     app.route('/preguntas')
    /* Obtiene preguntas */
        .get(function(req, res){

        var preguntas = new Preguntas();
        var promise = preguntas.findAll();
        promise.then(
            function(data){
                res.send(data);
            },
            function (error){
                res.status(500).send({error: error});
            }
        );
    });

};