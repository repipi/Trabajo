angular.module('Emozio').controller('PacientesPerfilController', function(Paciente, $scope, $routeParams, $location){

    /* Obtenemos el paciente que ha iniciado la sesion */
    Paciente.GetById($routeParams.id).then(function(data){
        $scope.paciente=Object.values(data.data)[0];
        //console.log($scope.paciente);
    });


    /* Funcion del boton "Hacer el test" */
    $scope.hacer=function(){
        /* Redireccionado al cuestionario */
        $location.path("cuestionario/" + 1 + "/" + $scope.paciente._id);   
    }
});