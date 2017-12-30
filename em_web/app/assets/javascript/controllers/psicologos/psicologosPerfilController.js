angular.module('Emozio').controller('PsicologosPerfilController', function(Psicologo, Paciente, $scope, $routeParams, $location, $window){

	/* Tomamos al psicologo indicado en los parametros */
	Psicologo.GetByParams($routeParams.id).then(function(data){
		$scope.psicologo=Object.values(data.data)[0];
	});

	/* Recuperamos al paciente */
	Paciente.GetById().then(function(data){
		if(!data.data || data.data=='') {
			//			$scope.nav_acceso=true;
			//			$scope.nav_gen=false;

			/* Recuperamos al psicologo */
			Psicologo.GetById().then(function(data){
				if(!data.data || data.data=='') {
					$scope.nav_acceso=true;
					$scope.nav_psico=false;
					$scope.nav_gen=false;
				} else {
					//$scope.psicologo=Object.values(data.data)[0];
					$scope.nav_acceso=false;
					$scope.nav_psico=true;
					$scope.nav_gen=false;
				}
			});
		} else {
			$scope.nav_acceso=false;
			$scope.nav_gen=true;
		}
	});

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.GetById().then(function(data){
			if(!data.data || data.data=='') {
				Psicologo.Salir();
			} else {
				Paciente.Salir();
			}
		});
		$location.path("inicio");
		/* Parche para cuando sales del perfil del psicologo */
		$window.location.reload(); 
	}

});