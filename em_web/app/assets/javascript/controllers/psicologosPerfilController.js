angular.module('Emozio').controller('PsicologosPerfilController', function(Psicologo, $scope, $routeParams){

    /* Tomamos al psicologo indicado en los parametros */
    $scope.psicologo=Psicologo.get({id:$routeParams.id});
    
});