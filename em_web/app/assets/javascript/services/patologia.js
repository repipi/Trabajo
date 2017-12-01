//angular.module('Emozio').factory('Patologia', function($resource){
//    /* Devuelve el objeto Patologia del modelo que esta registrado en server/route.js */
//    return $resource('/patologia');
//});

angular.module('Emozio').factory('Patologia', Patologia);

Patologia.$inject=['$http'];

function Patologia($http){   

    return {
        GetAll : function (){
            return $http.get('/patologias');
        }
    };
}