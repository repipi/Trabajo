/* Las dependencias del controller son los argumentos de function */
angular.module('Emozio').controller('PacientesAccesoController', function(Paciente, $scope, $location, session){

    $scope.mensaje_error_acceso;
    
    $scope.getSession = function() {
        return this.session;
    };
    
    $scope.setSession = function(session) {
        this.session = session;
    };

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