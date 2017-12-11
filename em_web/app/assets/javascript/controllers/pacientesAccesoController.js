angular.module('Emozio').controller('PacientesAccesoController', function(Paciente, $scope, $location){

    $scope.mensaje_error_acceso;

    /* Funcion de validacion del formulario de acceso */
    $scope.check = function(paciente) { 

        var pacienteConectado;
        
        Paciente.Login(paciente).then(function(data){
            pacienteConectado=Object.values(data.data);

            if(pacienteConectado!=null){
                $location.path("/usuarios/"+pacienteConectado[0]._id);
            }
        });
        
        $scope.mensaje_error_acceso="E-mail o contraseña incorrectos";
    }
});