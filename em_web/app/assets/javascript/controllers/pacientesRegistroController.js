angular.module('Emozio').controller('PacientesRegistroController', function(Paciente, $scope, $location){
    
    /* Funcion check que valida el cuestionario de registro */
    $scope.check = function(paciente) { 
        /* Se guarda el objeto paciente del formulario. Despues, */
        Paciente.SignUp(paciente).then(function(){
            /* Se redirecciona al perfil del paciente */
            $location.path("/usuarios/" + paciente.id);
        }); 
    }
});