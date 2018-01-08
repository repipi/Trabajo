var _ = require('lodash');

var psicologos = [
    /* 1 */
    {
        "id": 1,
        "nombre" : "Alfonso Pena",
        "edad" : 35,
        "email" : "alfonso@psico.com",
        "password" : "1234",
        "localizacion" : "Santiago",
        "telefono" : 123456789,
        "tipo" : "Clinico (PIR)",
        "ncolegiado" : 123456789,
        "experiencia" : "Tengo 6 años de experiencia ejerciendo en diferentes clinicas privadas",
        "formacion" : "Master en Psicopatologia infantil",
        "terapia" : "Terapia sistemica o familiar",
        "especialidad" : "Trastorno de estados de animo",
        "patologias" : ["Depresion", "Sintomas psicoticos"],
        "imagen" : "/assets/images/alfonso.png"
    },

    /* 2 */
    {
        "id": 2,
        "nombre" : "Maria Alegra",
        "edad" : 35,
        "email" : "maria@psico.com",
        "password" : "1234",
        "localizacion" : "Santiago",
        "telefono" : 123456789,
        "tipo" : "General Sanitaria (Master habilitante)",
        "ncolegiado" : 234567891,
        "experiencia" : "Recien titulada",
        "formacion" : "Formacion en terapias de tercera generacion (ACT, Mindfullnes, etc...)",
        "terapia" : "Terapia cognitivo-conductual",
        "patologias" : ["TAD (Transtorno de ansiedad generalizada)"],
        "imagen" : "/assets/images/maria.png"
    } 
];

module.exports = {
    /* Funcion get que devuelve un psicologo */
    get: function(id) {
        return _.find(psicologos, function(psicologo){
            return psicologo.id === id;
        });
    },

    /* Funcion all que devuelve a todos los psicologos */
    all: function() {
        return psicologos;
    }  

}