angular.module('Emozio').factory('Psicologo', Psicologo);

Psicologo.$inject=['$http'];

function Psicologo($http){   

    return {
        GetAll : function (){
            return $http.get('/psicologos');
        },
        GetById : function (id) {
            return $http.get('/psicologos/'+id);
        },
        Filtrar : function (psicologo) {
            return $http.post('/psicologos/filtrar', psicologo);
        }
    };
}