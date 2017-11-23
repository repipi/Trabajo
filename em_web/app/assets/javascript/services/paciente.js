angular.module('Emozio').factory('Paciente', function($resource){
    /* Devuelve el objeto Paciente del modelo que esta registrado en server/route.js */    
    return $resource('/pacientes/:id', {id: "@id"}, {
        update: {
            method: "PUT"
        }
    });
});