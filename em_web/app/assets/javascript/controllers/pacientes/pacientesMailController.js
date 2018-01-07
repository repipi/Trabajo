angular.module('Emozio').controller('PacientesMailController', function(Paciente, Mensaje, Psicologo, $scope, $location, $window){

	/* Obtenemos el paciente que ha iniciado la sesion */
	Paciente.GetById().then(function(data){
		if(!data.data || data.data=='') {
			$location.path("/");
		} else {
			$scope.paciente=Object.values(data.data)[0];
			//        console.log($scope.paciente);  
		}
	});

	//	Mensaje.GetMsjPaciente().then(function(data){
	//		$scope.mensajes = Object.values(data.data);
	//		//		console.log($scope.mensajes);
	//	});

	Mensaje.GetMsjPendPac().then(function(data){
		$scope.mensajesPendientes=Object.values(data.data);
		$scope.mensajes  = $scope.mensajesPendientes.slice();
		if (!$scope.mensajes.length) {
			$scope.sin_mensajes = true;
		}
		$scope.numMsjPendientes = $scope.mensajesPendientes.length;
	});

	Mensaje.GetMsjAceptPac().then(function(data){
		$scope.mensajesAceptados=Object.values(data.data);
		$scope.numMsjAceptados = $scope.mensajesAceptados.length;
	});

	Mensaje.GetMsjRechPac().then(function(data){
		$scope.mensajesRechazados=Object.values(data.data);
		$scope.numMsjRechazados = $scope.mensajesRechazados.length;
	});

	/* Estados del menu */
	$scope.pendientes="active teal item";
	$scope.aceptadas="item";
	$scope.rechazadas="item";

	$scope.cambiarMenu = function(numero){
		if(numero == 1) {
			$scope.pendientes="active teal item";
			$scope.aceptadas="item";
			$scope.rechazadas="item";
			$scope.mensajes = $scope.mensajesPendientes.slice();
		} else if (numero == 2) {
			$scope.pendientes="item";
			$scope.aceptadas="active teal item";
			$scope.rechazadas="item";
			$scope.mensajes = $scope.mensajesAceptados.slice();
		} else if (numero == 3) {
			$scope.pendientes="item";
			$scope.aceptadas="item";
			$scope.rechazadas="active teal item";
			$scope.mensajes = $scope.mensajesRechazados.slice();
		}
	}

	//	$scope.getPsico = function(id){
	//		Psicologo.GetByParams(id).then(function(data){
	////			$scope.mensaje.psicologo=Object.values(data.data)[0];
	//		});
	//	};

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.Salir();
		$location.path("inicio"); 
	}

});