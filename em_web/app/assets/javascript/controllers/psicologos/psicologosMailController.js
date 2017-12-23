angular.module('Emozio').controller('PsicologosMailController', function(Psicologo, $scope, $routeParams){

    /* Tomamos al psicologo indicado en los parametros */
    Psicologo.GetById($routeParams.id).then(function(data){
        $scope.psicologo=Object.values(data.data)[0];
    });

});