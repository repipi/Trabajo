angular.module('Emozio').factory('Psicologo', function($resource){
    /* Devuelve el objeto Psicologo del modelo que esta registrado en server/route.js */
    return $resource('/psicologos/:id');
});