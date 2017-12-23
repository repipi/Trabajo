angular.module('Emozio').controller('PacientesModificarController', function(Paciente, $scope, $location){

    /* Obtenemos el paciente que ha iniciado la sesion */
    Paciente.GetById().then(function(data){
        if(!data.data) {
              $location.path("/");
        } else {
            $scope.paciente=Object.values(data.data)[0];
            //        console.log($scope.paciente);  
        }
    });

    /* Funcion check que valida el cuestionario de registro */
    $scope.check = function(paciente) { 
        /* Indicamos que se esta tratando de enviar */
        $scope.isSubmitting = true;

        if($scope.formulario_registro.$valid){
            /* Se guarda el objeto paciente del formulario. Despues, */
            Paciente.Update(paciente).then(function(){
                /* Se redirecciona al perfil del paciente */
                $location.path("/usuarios");
            }); 

        }
    }

    /* Funcion salir que cierra la sesion */
    $scope.salir=function(){
        Paciente.Salir();
        $location.path("inicio"); 
    }
});