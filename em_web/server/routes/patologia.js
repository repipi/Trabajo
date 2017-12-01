var Patologia = require('../models/patologia')

module.exports = function(app) {

    app.route('/patologias')
    /* Obtiene patologias */
        .get(function(req, res){

        var patologia = new Patologia();
        var promise = patologia.findAll();
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