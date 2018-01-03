angular.module('Emozio').factory('Mensaje', Mensaje);

Mensaje.$inject=['$http'];

function Mensaje($http){   

    return {
        SendMsg : function (mensaje){
            return $http.post('/mensajes/mensajePaciente', mensaje);
        }
    };
}