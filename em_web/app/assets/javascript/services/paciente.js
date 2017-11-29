angular.module('Emozio').factory('Paciente', Paciente);

Paciente.$inject=['$http'];

function Paciente($http){   

    return {
        GetAll : function (){
            return $http.get('/pacientes');
            promise.then(
                function(res){
                    //console.log(res.data);
                    return res.data;
                },
                function (res){
                    console.log("error: "+res);
                });
        }
        //    service.GetById = function (id) {
        //        return $http.get('/pacientes/'+id);
        //    }
        //
        //    service.Login = function (paciente) {
        //        return $http.post('/pacientes/acceso', paciente);
        //    }
    };
}