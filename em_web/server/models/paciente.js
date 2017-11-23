var _ = require('lodash');

var pacientes = [
    /* 1 */
    {
        "id": 0,
        "email" : "rgm@gmail.com",
        "password" : "1234",
        "localizacion" : "Santiago",
        "telefono" : "123456789",
        "sintomas" : [],
        "patologia" : [],
        "psicologos" : []
    },

    /* 2 */
    {
        "id": 1,
        "email" : "rgm1@gmail.com",
        "password" : "1234",
        "localizacion" : "Santiago",
        "telefono" : "123456789",
        "sintomas" : [],
        "patologia" : [],
        "psicologos" : []
    },

    /* 3 */
    {
        "id": 2,
        "email" : "rgm2@gmail.com",
        "password" : "1234",
        "localizacion" : "Santiago",
        "telefono" : "123456789",
        "sintomas" : [],
        "patologia" : [],
        "psicologos" : []
    }
];

module.exports = {

    /* Funcion get que devuelve a un paciente mediante su email */
    get: function(id) {
        return _.find(pacientes, function(paciente){
            return paciente.id === id;
        });
    },

    /* Funcion all que devuelve a todos los pacientes */
    all: function() {
        return pacientes;
    },

    /* Funcion update que actualiza los datos de un paciente */
    update: function(paciente) {
        /* Bucle que recorre todos los elementos de pacientes */
        for(var i=0, l=pacientes.length; i < l; i++) {
            /* Si el email del paciente de la posicion i es igual al que metemos por parametros */
            if(pacientes[i].email === paciente.email){
                /* Se guarda al paciente actualizado en esa posicion */
                _.assign(pacientes[i], paciente);
                break;
            }
        }
    },

    /* Funcion que crea un nuevo paciente */
    create: function(paciente) {
        paciente.id = pacientes.length;
        paciente.sintomas = [];
        paciente.patologia = [];
        paciente.psicologos = [];
        pacientes.push(paciente);
        return paciente;
    }
}