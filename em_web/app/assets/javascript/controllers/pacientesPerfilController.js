angular.module('Emozio').controller('PacientesPerfilController', function(Paciente, $scope, $routeParams, $location){

    /* Obtenemos el paciente que ha iniciado la sesion */
    $scope.paciente=Paciente.get({id:$routeParams.id});

    /*if($scope.paciente.sintomas.length==0){
        $scope.visible=false;
    }else{
        $scope.visible=true;
    }*/


    /* Funcion del boton "Hacer el test" */
    $scope.hacer=function(){
        /* Redireccionado al cuestionario */
        $location.path("cuestionario/"+$scope.paciente.id);   
    }
});