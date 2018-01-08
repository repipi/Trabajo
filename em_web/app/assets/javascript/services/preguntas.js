/* Angular $resource crea una instancia del objeto
Factory genera los objetos del modelo 
Los datos se obtienen de server/routes */
angular.module('Emozio').factory('Preguntas', function($resource){
    /* Devuelve el objeto preguntas del modelo que esta registrado en server/route.js */
    return $resource('/preguntas');
});