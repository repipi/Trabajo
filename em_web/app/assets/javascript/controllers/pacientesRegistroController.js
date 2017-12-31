angular.module('Emozio').controller('PacientesRegistroController', function(Paciente, $scope, $location){
    
    /* Se crea un nuevo objeto Paciente */
    $scope.paciente = new Paciente();

    /* Funcion check que valida el cuestionario de registro */
    $scope.check = function(paciente) { 
        /* Se guarda el objeto paciente del formulario. Despues, */
        paciente.$save().then(function(){
            /* Se redirecciona al perfil del paciente */
            $location.path("/usuarios/" + paciente.id);  
        }); 
    }
});