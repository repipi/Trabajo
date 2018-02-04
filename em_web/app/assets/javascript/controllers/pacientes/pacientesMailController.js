angular.module('Emozio').controller('PacientesMailController', function(Paciente, Mensaje, Psicologo, $scope, $location, $window){

	/* Obtenemos el paciente que ha iniciado la sesion */
	Paciente.GetById().then(function(data){ /* Recuperamos al paciente */
		if(!data.data || data.data=='') { /* Si el paciente no ha iniciado la sesion, no se obtendra */
			$location.path("/"); /* Se redirige a la pagina de inicio */
		} else {
			$scope.paciente=Object.values(data.data)[0];
		}
	});

	/* Se recuperan los mensajes pendientes del paciente */
	Mensaje.GetMsjPendPac().then(function(data){
		$scope.mensajesPendientes=Object.values(data.data);
		/* Los mensajes que se van a mostrar al iniciar la pagina, seran los mensajes pendientes */
		$scope.mensajes  = $scope.mensajesPendientes.slice(); 
		if (!$scope.mensajes.length) { /* Si no hay mensajes mostrados */
			$scope.sin_mensajes = true; /* Se muestra el aviso de que no hay mensajes */
		} else {
			$scope.sin_mensajes = false; /* Oculta el aviso de que no hay mensajes */
		}
		$scope.numMsjPendientes = $scope.mensajesPendientes.length; /* Se guarda el numero de mensajes pendientes */
	});

	/* Se recuperan los mensajes aceptados del paciente */
	Mensaje.GetMsjAceptPac().then(function(data){
		$scope.mensajesAceptados=Object.values(data.data);
		$scope.numMsjAceptados = $scope.mensajesAceptados.length; /* Se guarda el numero de mensajes aceptados */
	});

	/* Se recuperan los mensajes rechazados del paciente */
	Mensaje.GetMsjRechPac().then(function(data){
		$scope.mensajesRechazados=Object.values(data.data);
		$scope.numMsjRechazados = $scope.mensajesRechazados.length; /* Se guarda el numero de mensajes rechazados */
	});

	$scope.mensaje = {}; /* Mensaje seleccionado */
	/* Funcion que establece cual es el mensaje que ha sido seleccionado */
	$scope.mensajeSeleccionado = function(mensaje) {
		$scope.mensaje = mensaje;
	}

	/* Estados del menu al iniciar la pagina: La opcion de los mensajes pendientes esta activada y el resto desactivadas */
	$scope.pendientes="active teal item";
	$scope.aceptadas="item";
	$scope.rechazadas="item";

	/* Funcion que cambia la apariencia del menu */
	$scope.cambiarMenu = function(numero){
		if(numero == 1) {  /* Si se trata de la primera opcion del menu */
			$scope.pendientes="active teal item"; /* La opcion de mensajes pendientes esta activada y el resto desactivadas */
			$scope.aceptadas="item";
			$scope.rechazadas="item";
			$scope.mensajes = $scope.mensajesPendientes.slice(); /* Los mensajes mostrados son los pendientes */
			/* Si no hay mensajes, se muestra un aviso */
			if (!$scope.mensajes.length) {
				$scope.sin_mensajes = true;
			} else {
				$scope.sin_mensajes = false;
			}
		} else if (numero == 2) { /* Si se trata de la segunda opcion del menu */
			$scope.pendientes="item";
			$scope.aceptadas="active teal item";  /* La opcion de mensajes aceptados esta activada y el resto desactivadas */
			$scope.rechazadas="item";
			$scope.mensajes = $scope.mensajesAceptados.slice(); /* Los mensajes mostrados son los aceptados */
			/* Si no hay mensajes, se muestra un aviso */
			if (!$scope.mensajes.length) {
				$scope.sin_mensajes = true;
			} else {
				$scope.sin_mensajes = false;
			}
		} else if (numero == 3) { /* Si se trata de la tercera opcion del menu */
			$scope.pendientes="item";
			$scope.aceptadas="item";
			$scope.rechazadas="active teal item";  /* La opcion de mensajes rechazados esta activada y el resto desactivadas */
			$scope.mensajes = $scope.mensajesRechazados.slice(); /* Los mensajes mostrados son los rechazados */
			/* Si no hay mensajes, se muestra un aviso */
			if (!$scope.mensajes.length) {
				$scope.sin_mensajes = true;
			} else {
				$scope.sin_mensajes = false;
			}
		}
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.Salir(); /* Se cierra la sesion del paciente */
		$location.path("inicio"); /* Se redirige a la pagina de inicio */
		$window.location.reload();  /* Se recarga la pagina actual */
	}

});