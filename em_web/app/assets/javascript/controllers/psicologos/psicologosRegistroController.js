angular.module('Emozio').controller('PsicologosRegistroController', function(Psicologo, $scope, $routeParams){

    $scope.paso_1 = true;
    $scope.paso_2 = false;
    $scope.paso_3 = false;
    $scope.estado_1 = 'active';

    /* Cambiar paso */
    $scope.changeStep = function (psicologo) { 

        if ($scope.paso_1 == true) {
            $scope.paso_1 = false;
            $scope.paso_2 = true;
            $scope.paso_3 = false;
            $scope.estado_1 = 'disabled';
            $scope.estado_2 = 'active';
        } else if ($scope.paso_2 == true) {
            $scope.paso_1 = false;
            $scope.paso_2 = false;
            $scope.paso_3 = true;
            $scope.estado_1 = 'disabled';
            $scope.estado_2 = 'disabled';
            $scope.estado_3 = 'active';
        } else if ($scope.paso_3 == true) {
            $scope.paso_1 = false;
            $scope.paso_2 = false;
            //            $scope.paso_3 = false;
            $scope.estado_1 = 'disabled';
            $scope.estado_2 = 'disabled';
            $scope.estado_3 = 'disabled';

            Psicologo.SignUp(psicologo);

            $scope.mensaje_exito = true;
        } 

    }

});