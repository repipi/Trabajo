/* Las dependencias del controller son los argumentos de function */
angular.module('Emozio').controller('PacientesAccesoController', function(Paciente, $scope, $location){

    /* Se establece el mensaje de control de acceso */
    $scope.mensaje_error_acceso;
    

    /* Funcion de validacion del formulario de acceso */
    $scope.check = function(paciente) { 

        var pacienteConectado;
        
        /* Se hace LogIn con los datos que ha introducido en el formulario el paciente */
        Paciente.LogIn(paciente).then(function(data){
            pacienteConectado=Object.values(data.data);

            /* Si existe el paciente en cuestion, se reconduce a su pagina de resultados */
            if(pacienteConectado!=null){
                $location.path("/usuarios");
            }
        });
        
        /* Se avisa de que los datos no son correctos */
        $scope.mensaje_error_acceso="E-mail o contraseña incorrectos";
    }
});