angular.module('Emozio').controller('PsicologosMailController', function(Psicologo, Mensaje, $scope, $routeParams, $filter, $location, $window){

	/* Se comprueba que el psicologo ha iniciado la sesion */
	Psicologo.GetById().then(function(data){ /* Recuperamos al psicologo */
		if(!data.data || data.data=='') { /* Si el psicologo no ha iniciado la sesion, no se obtendra */
			$location.path("/"); /* Se redirige a la pagina de inicio */
		} else {
			$scope.psicologo=Object.values(data.data)[0];
			$scope.nav_acceso=false; /* Se oculta el menu de acceso */
			$scope.nav_psico=true; /* Se muestra el menu del psicologo */
			$scope.nav_gen=false; /* Se oculta el menu generico */
		}
	});

	var cita; /* Fecha de la cita indicada por el psicologo */
	/* Activa el calendario */
	$('#cita').calendar({
		formatter: { /* Se da formato a la fecha y hora de la cita */
			date: function (date, settings) {
				if (!date) return '';
				return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + "; ";
			},
			time: function (date, settings, forCalendar) {
				if (!date) return '';
				return (date.getHours()<10?'0':'') + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" + (date.getSeconds()<10?'0':'') + date.getSeconds();
			}
		},
		onChange: function (date, text) { /* Si el campo cambia, se guarda la cita introducida */
			cita = text;
		}
	});

	/* Activa el pop-up de ayuda */
	$('#ayuda_cita').popup();

	/* Se recuperan los mensajes pendientes del psicologo */
	Mensaje.GetMsjPendPsico().then(function(data){
		$scope.mensajesPendientes=Object.values(data.data);
		/* Se establece el numero de mensajes pendientes */
		$scope.numMsjPendientes = $scope.mensajesPendientes.length;
		/* Los mensajes mostrados al cargar la pagina son los pendientes */
		$scope.mensajes = $scope.mensajesPendientes.slice();
		/* Si no hay mensajes, se muestra un aviso */
		if (!$scope.mensajes.length) {
			$scope.sin_mensajes = true;
		}
	});

	/* Se recuperan los mensajes aceptados del psicologo */
	Mensaje.GetMsjAceptPsico().then(function(data){
		$scope.mensajesAceptados=Object.values(data.data);
		/* Se establece el numero de mensajes aceptados */
		$scope.numMsjAceptados = $scope.mensajesAceptados.length;
	});

	/* Se recuperan los mensajes rechazados del psicologo */
	Mensaje.GetMsjRechPsico().then(function(data){
		$scope.mensajesRechazados=Object.values(data.data);
		/* Se establece el numero de mensajes rechazados */
		$scope.numMsjRechazados = $scope.mensajesRechazados.length;
	});

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
		} else if (numero == 2) { /* Si se trata de la segunda opcion del menu */
			$scope.pendientes="item";
			$scope.aceptadas="active teal item";  /* La opcion de mensajes aceptados esta activada y el resto desactivadas */
			$scope.rechazadas="item";
			$scope.mensajes = $scope.mensajesAceptados.slice(); /* Los mensajes mostrados son los aceptados */
		} else if (numero == 3) { /* Si se trata de la tercera opcion del menu */
			$scope.pendientes="item";
			$scope.aceptadas="item";
			$scope.rechazadas="active teal item";  /* La opcion de mensajes rechazados esta activada y el resto desactivadas */
			$scope.mensajes = $scope.mensajesRechazados.slice(); /* Los mensajes mostrados son los rechazados */
		}
	}

	/* Validacion del formulario de aceptacion */
	$('#acepta_form').form({
		on : 'blur', /* Cada elemento se evalua por separado */
		inline: 'false', /* Los mensajes de validacion no se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			mensaje : {
				identifier : 'mensaje',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce un mensaje.'
					},
					{
						type: 'maxLength[500]',
						prompt: 'Demasiados carácteres.'
					}
				]
			},      
			cita : {
				identifier: 'cita',
				rules: [
					{
						type: 'empty',
						prompt: 'Por favor, introduce una cita.'
					}
				]
			}
		}
	}); 

	/* Validacion de formulario de rechazo */
	$('#rechaza_form').form({
		on : 'blur',/* Cada elemento se evalua por separado */
		inline: 'false', /* Los mensajes de validacion no se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			mensaje : {
				identifier : 'mensaje',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce un mensaje.'
					},
					{
						type: 'maxLength[500]',
						prompt: 'Demasiados carácteres.'
					}
				]
			}
		}
	}); 

	$scope.mensaje = {}; /* Mensaje seleccionado */
	/* Establece cual es el mensaje que ha sido seleccionado */
	$scope.mensajeSeleccionado = function(mensaje) {
		$scope.mensaje._id = mensaje._id;
	}

	/* Funcion que envia un mensaje de aceptacion a la peticion del paciente que ha enviado el mensaje seleccionado */
	$scope.enviarMensaje = function(mensaje) {

		//		if($('#contacto_form').form('is valid')) {

		/* Se establecen los datos del mensaje */
		mensaje.fechaCita = cita;
		mensaje.acepta = true;
		mensaje.rechaza = false;
		mensaje._id = $scope.mensaje._id;

		/* Se guarda el mensaje de respuesta del psicologo */
		Mensaje.SendMsgPsico(mensaje);

		/* Se muestra un mensaje de exito */
		$scope.msj_exito_contacto = true;

		/* Tras un segundo, la ventana se recarga: Desaparece el modal */
		setTimeout(function(){
			$location.path("/mail"); /* Se redirige a la pagina de la bandeja de entrada */
			$window.location.reload(); /* Se recarga la pagina actual */
		}, 1000);

	}

	/* Funcion que envia un mensaje de rechazo a la peticion del paciente que ha enviado el mensaje seleccionado */
	$scope.enviarRechazo = function(mensaje) {

		/* Se establecen los datos del mensaje */
		mensaje.acepta = false;
		mensaje.rechaza = true;
		mensaje._id = $scope.mensaje._id;

		/* Se guarda el mensaje de respuesta del psicologo */
		Mensaje.SendMsgPsico(mensaje);

		/* Se muestra un mensaje de exito */
		$scope.msj_exito_contacto = true;

		/* Tras un segundo, la ventana se recarga: Desaparece el modal */
		setTimeout(function(){
			$location.path("/mail"); /* Se redirige a la pagina de la bandeja de entrada */
			$window.location.reload(); /* Se recarga la pagina actual */
		}, 1000);
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Psicologo.Salir(); /* Se cierra la sesion del psicologo */
		$location.path("inicio"); /* Se redirige a la pagina de inicio */
	}

});