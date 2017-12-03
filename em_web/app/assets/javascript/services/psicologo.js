//angular.module('Emozio').factory('Psicologo', function($resource){
//    /* Devuelve el objeto Psicologo del modelo que esta registrado en server/route.js */
//    return $resource('/psicologos/:id');
//});

angular.module('Emozio').factory('Psicologo', Psicologo);

Psicologo.$inject=['$http'];

function Psicologo($http){   

    return {
        GetAll : function (){
            return $http.get('/psicologos');
        },
        GetById : function (id) {
            return $http.get('/psicologos/'+id);
        }
    };
}