angular.module('Emozio').controller('PsicologosMailController', function(Psicologo, Mensaje, $scope, $routeParams, $filter, $location, $window){

	/* Recuperamos al psicologo */
	Psicologo.GetById().then(function(data){
		if(!data.data || data.data=='') {
			$location.path("/");
		} else {
			$scope.psicologo=Object.values(data.data)[0];
			$scope.nav_acceso=false;
			$scope.nav_psico=true;
			$scope.nav_gen=false;
		}
	});

	/* Activa el calendario */
	var cita;
	$('#cita').calendar({
		formatter: {
			date: function (date, settings) {
				if (!date) return '';
				return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + "; ";
			},
			time: function (date, settings, forCalendar) {
				if (!date) return '';
				return (date.getHours()<10?'0':'') + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" + (date.getSeconds()<10?'0':'') + date.getSeconds();
			}
		},
		onChange: function (date, text) {
			cita = text;
		}
	});

	/* Activa el pop-up de ayuda */
	$('#ayuda_cita').popup();

	Mensaje.GetMsjPendPsico().then(function(data){
		$scope.mensajesPendientes=Object.values(data.data);
		$scope.numMsjPendientes = $scope.mensajesPendientes.length;
		$scope.mensajes = $scope.mensajesPendientes.slice();
		if (!$scope.mensajes.length) {
			$scope.sin_mensajes = true;
		}
	});

	Mensaje.GetMsjAceptPsico().then(function(data){
		$scope.mensajesAceptados=Object.values(data.data);
		$scope.numMsjAceptados = $scope.mensajesAceptados.length;
	});

	Mensaje.GetMsjRechPsico().then(function(data){
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
	
	/* Validacion de formulario de aceptacion */
	$('#acepta_form').form({
		on : 'blur',
		inline: 'false',
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
	
	/* Validacion de formulario de aceptacion */
	$('#rechaza_form').form({
		on : 'blur',
		inline: 'false',
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

	/* Establece cual es el mensaje que ha sido seleccionado */
	$scope.mensaje = {};
	$scope.mensajeSeleccionado = function(mensaje) {
		$scope.mensaje._id = mensaje._id;
	}

	$scope.enviarMensaje = function(mensaje) {

		//		if($('#contacto_form').form('is valid')) {

		mensaje.fechaCita = cita;
		mensaje.acepta = true;
		mensaje.rechaza = false;
		mensaje._id = $scope.mensaje._id;

		Mensaje.SendMsgPsico(mensaje);

		$scope.msj_exito_contacto = true;

		setTimeout(function(){
			$location.path("/mail"); 
			$window.location.reload();
		}, 1000);

	}

	$scope.enviarRechazo = function(mensaje) {
		mensaje.acepta = false;
		mensaje.rechaza = true;
		mensaje._id = $scope.mensaje._id;

		Mensaje.SendMsgPsico(mensaje);

		$scope.msj_exito_contacto = true;

		setTimeout(function(){
			$location.path("/mail"); 
			$window.location.reload();
		}, 1000);
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Psicologo.Salir();
		$location.path("inicio"); 
	}

});