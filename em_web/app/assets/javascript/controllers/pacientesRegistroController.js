angular.module('Emozio').controller('PacientesRegistroController', function(Paciente, $scope, $location){

    /* Funcion check que valida el cuestionario de registro */
    $scope.check = function(paciente) { 
        /* Indicamos que se esta tratando de enviar */
        $scope.isSubmitting = true;

        if($scope.formulario_registro.$valid){
            /* Se guarda el objeto paciente del formulario. Despues, */
            Paciente.SignUp(paciente).then(function(){
                /* Se redirecciona al perfil del paciente */
                $location.path("/usuarios");
            }); 

        }
    }
});