angular.module('Emozio').controller('PacientesAccesoController', function(Paciente, $scope, $location){

    Paciente.GetAll().then(function(data){
        $scope.pacientes = Object.values(data.data);
        console.log($scope.pacientes);
        
        for(var i=0, l=$scope.pacientes.length; i<l; i++){
            console.log(i+"\t"+$scope.pacientes[i].email);
        }
    });
    


    /* Funcion de validacion del formulario de acceso */
    $scope.check = function(paciente) { 

        var pacienteConectado= Paciente.Login(paciente);

        if(pacienteConectado>0){
            $location.path("/usuarios/"+pacienteConectado.id);
        }
    }
});