angular.module('Emozio').factory('Paciente', Paciente);

Paciente.$inject=['$http'];

function Paciente($http){   

    return {
        GetAll : function (){
            return $http.get('/pacientes');
        },
        GetById : function () {
            return $http.get('/pacientes');
        },
        LogIn : function(paciente) {
            return $http.post('/pacientes/acceso', paciente);
        },
        SignUp : function(paciente) {
            return $http.post('/pacientes/registro', paciente);
        },
        Update : function(paciente) {
            return $http.put('/pacientes', paciente);
        },
        GetDiagnostico : function(id) {
            return $http.get('/pacientes/'+id+'/diagnostico');   
        }
    };
}