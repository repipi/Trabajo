angular.module('Emozio').controller('PacientesAccesoController', function(Paciente, $scope, $location){

    /* Guarda todos los pacientes de la BBDD */
    $scope.pacientes = Paciente.query();

    /* Funcion de validacion del formulario de acceso */
    $scope.check = function(paciente) { 
        
        /* Se recorren todos los pacientes */
        for(var i=0, l=$scope.pacientes.length; i<l; i++){
            /* Si el email y el password coinciden con los de uno de los pacientes */
            if($scope.pacientes[i].email==paciente.email && $scope.pacientes[i].password==paciente.password){
                /* Se accede a la cuenta de ese paciente */
                $location.path("/usuarios/"+$scope.pacientes[i].id);
            }
        }
    }
});