angular.module('Emozio').factory('Patologia', function($resource){
    /* Devuelve el objeto Patologia del modelo que esta registrado en server/route.js */
    return $resource('/patologia');
});