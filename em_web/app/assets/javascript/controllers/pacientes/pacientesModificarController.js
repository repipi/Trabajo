angular.module('Emozio').controller('PacientesModificarController', function(Paciente, $scope, $location, $window){

	/* Obtenemos el paciente que ha iniciado la sesion */
	Paciente.GetById().then(function(data){ /* Recuperamos al paciente */
		if(!data.data || data.data=='') { /* Si el paciente no ha iniciado la sesion, no se obtendra */
			$location.path("/"); /* Se redirige a la pagina de inicio */
		} else {
			$scope.paciente=Object.values(data.data)[0];
		}
	});

	/* Se ocultan todos los posibles mensajes de exito y error del formulario de modificacion de datos y modificacion de contraseña */
	$scope.msj_exito_datos=false;
	$scope.msj_error_datos=false;
	$scope.msj_exito_password=false;
	$scope.msj_error_password=false;

	/* Google Place API Web Service */
	var autocomplete;   
	var place;

	/* Funcion que inicializa el autocompletado de Google */
	$scope.initAutocomplete = function() {
		/* Se crea el objeto de autocompletado, restringiendolo la busqueda a los tipos geograficos */
		autocomplete = new google.maps.places.Autocomplete(
			(document.getElementById('autocomplete')),
			{ types: ['(cities)'], /* Se buscaran ciudades */
			 componentRestrictions: {country: "es"}}); /* Restringidas dentro de España */

		/* Cuando el usuario selecciona una opcion del desplegable, se ejecuta la funcion indicada */
		autocomplete.addListener('place_changed', fillInAddress);

		/* Funcion que recupera el lugar escogido en el autocompletado */
		function fillInAddress() {
			/* Toma los detalles del lugar del objeto de autocompletado */
			place = autocomplete.getPlace();
		}
	}

	/* Funcion que establece los valores de geolocalizacion */
	$scope.geolocate = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				var circle = new google.maps.Circle({
					center: geolocation,
					radius: position.coords.accuracy
				});
				//autocomplete.setBounds(circle.getBounds());
			});
		}
	}

	/* Cuando se apunta al elemento autocomplete, se inicia la funcion geolocate */
	$("#autocomplete").focus(function() {
		$scope.geolocate();
	});

	/* Validacion de formulario de modificacion de datos */
	$('#change_form').form({
		on : 'blur', /* Cada elemento se evalua por separado */
		inline: 'true', /* Los mensajes de validacion se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			email : {
				identifier : 'email',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduzca un e-mail.'
					},
					{
						type: 'email',
						prompt: 'El formato del e-mail es incorrecto.'
					}
				]
			},      
			genero : {
				identifier : 'genero',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce tu género.'
					}
				]
			},
			edad : {
				identifier : 'edad',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce tu fecha de nacimiento.'
					}
				]
			},
			localizacion : {
				identifier : 'localizacion',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduzca una localización.'
					}
				]
			},
			telefono : {
				identifier : 'telefono',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduzca un teléfono.'
					},
					{
						type : 'exactLength[9]',
						prompt : 'El formato del teléfono es incorrecto.'
					}
				]
			},
			password: {
				identifier: 'password',
				rules: [
					{
						type: 'empty',
						prompt: 'Por favor, introduzca una contraseña.'
					},
					{
						type: 'maxLength[15]',
						prompt: 'La contraseña debe tener menos de 15 carácteres.'
					},
					{
						type: 'minLength[8]',
						prompt: 'La contraseña debe tener mínimo 8 carácteres.'
					}, 
					{
						type: 'regExp[^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$]',
						prompt: 'La contraseña debe contener al menos una minúscula, una mayúscula y un dígito.'
					}
				]
			}
		}
	}); 

	/* Validacion de formulario de modificacion de contraseña */
	$('#password_form').form({
		on : 'blur', /* Cada elemento se evalua por separado */
		inline: 'true', /* Los mensajes de validacion se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {    
			passwordActual: {
				identifier: 'passwordActual',
				rules: [
					{
						type: 'empty',
						prompt: 'Por favor, introduce una contraseña.'
					}
				]
			},
			passwordNueva: {
				identifier: 'passwordNueva',
				rules: [
					{
						type: 'empty',
						prompt: 'Por favor, introduce una contraseña.'
					},
					{
						type: 'maxLength[15]',
						prompt: 'La contraseña debe tener menos de 15 carácteres.'
					},
					{
						type: 'minLength[8]',
						prompt: 'La contraseña debe tener mínimo 8 carácteres.'
					}
					//					, 
					//					{
					//						type: 'regExp[^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$]',
					//						prompt: 'La contraseña debe contener al menos una minúscula, una mayúscula y un dígito.'
					//					}
				]
			}
		}
	}); 

	var edad; /* Edad del paciente */

	/* Se genera el calendario */
	$('#edad').calendar({
		type: 'date', /* El tipo es una fecha */
		onChange: function (date, text) { /* Cuando se rellena el campo */
			edad = text; /* Se establece que la edad es el contenido */
		}
	});

	/* Funcion de cambio de datos del paciente */
	$scope.cambiarDatos = function(paciente) { 

		/* Indicamos que se esta tratando de enviar */
		$scope.isSubmitting = true;

		/* Si la validacion del formulario de modificacion de datos es correcta */
		if($('#change_form').form('is valid')) {

			/* Se guarda el objeto paciente del formulario */
			Paciente.Update({
				_id: paciente._id,
				email: paciente.email,
				password: paciente.password,
				genero: paciente.genero,
				edad: edad,
				localizacion: place.name,
				telefono: paciente.telefono            
			})
				.then(function(data){ /* Una vez ejecutada, se muestran los siguientes avisos */
				if(data.data) { /* Si se ha modificado correctamente, se muestra el aviso de exito */
					$scope.msj_exito_datos=true;	
					$scope.msj_error_datos=false;
				} else { /* Si no, el aviso de error */
					$scope.msj_exito_datos=false;	
					$scope.msj_error_datos=true;
				}
			}); 

		}
	}

	/* Funcion de cambio de contraseña del paciente */
	$scope.cambiarPassword = function(paciente) { 

		/* Indicamos que se esta tratando de enviar */
		$scope.isSubmitting = true;

		/* Si la validacion del formulario de modificacion de contraseña es correcta */
		if($('#password_form').form('is valid')) {

			/* Se llama a la funcion que cambia la contraseña */
			Paciente.ChangePassword(paciente).then(function(data){
				if(data.data) { /* Si se cambia correctamente */
					$scope.msj_exito_password=true;	 /* Se muestra el mensaje de exito */
					$scope.msj_error_password=false;
				} else { /* Si no */
					$scope.msj_exito_password=false;	
					$scope.msj_error_password=true; /* Se muestra el mensaje de error */
				}
			}); 

		}
	}

	/* Funcion de darse de baja */
	$scope.baja=function(){
		Paciente.DarBaja(); /* Se da de baja al paciente */
		$location.path("inicio"); /* Se redirige a la pagina de inicio */
		$window.location.reload(); /* Se recarga la pagina */
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		/* Se comprueba que el paciente ha iniciado la sesion */
		Paciente.GetById().then(function(data){ /* Recuperamos al paciente */
			if(!data.data || data.data=='') { /* Si no existe, se trata de un psicologo */
				Psicologo.Salir(); /* Se cierra la sesion del psicologo */
			} else { /* Si lo es */
				Paciente.Salir(); /* Se cierra la sesion del paciente */
			}
			/* Se redirige a la pagina de inicio */
			$location.path("inicio"); 
			$window.location.reload();  /* Se recarga la pagina actual */
		});

	}
});