angular.module('Emozio').factory('Patologia', Patologia);

Patologia.$inject=['$http'];

function Patologia($http){   

    return {
        GetAll : function (){
            return $http.get('/patologias');
        },
        GetPreguntas : function (index){
            return $http.get('/patologias/preguntas', index);
        }
    };
}