angular.module('Emozio').factory('Patologia', Patologia);

Patologia.$inject=['$http']; /* Especifica la dependencia que necesita el injector. En este caso, http */

function Patologia($http){   

    return {
		/* Obtiene todas las patologias */
        GetAll : function (){
            return $http.get('/patologias');
        },
		/* Obtiene todas las preguntas asociadas a las patologias */
        GetPreguntas : function (index){
            return $http.get('/patologias/preguntas', index);
        }
    };
}