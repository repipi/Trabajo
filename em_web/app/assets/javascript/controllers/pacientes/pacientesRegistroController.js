angular.module('Emozio').controller('PacientesRegistroController', function(Paciente, Psicologo, $scope, $location){

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
					$location.path("/inicio");
				}
			});
		} else {
			$location.path("/inicio");
		}
	});

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

	/* Validacion de formulario de acceso */
	$('#access_form').form({
		/* Cada elemento se evalua por separado */
		inline: 'false', /* Los mensajes de validacion no se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			email : {
				identifier : 'email',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce un e-mail.'
					},
					{
						type: 'email',
						prompt: 'El formato del e-mail es incorrecto.'
					},
					{
						type: 'maxLength[50]',
						prompt: 'Demasiados carácteres.'
					}
				]
			},      
			password: {
				identifier: 'password',
				rules: [
					{
						type: 'empty',
						prompt: 'Por favor, introduce una contraseña.'
					},
					{
						type: 'maxLength[50]',
						prompt: 'Demasiados carácteres.'
					}
				]
			}
		}
	}); 

	/* Validacion de formulario de registro */
	$('#register_form').form({
		/* Cada elemento se evalua por separado */
		inline: 'true', /* Los mensajes de validacion se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			email : {
				identifier : 'email',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce un e-mail.'
					},
					{
						type: 'email',
						prompt: 'El formato del e-mail es incorrecto.'
					},
					{
						type: 'maxLength[50]',
						prompt: 'Demasiados carácteres.'
					}
				]
			},      
			password: {
				identifier: 'password',
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
						prompt : 'Por favor, introduce una localización.'
					}
				]
			},
			telefono : {
				identifier : 'telefono',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce un teléfono.'
					},
					{
						type : 'exactLength[9]',
						prompt : 'El formato del teléfono es incorrecto.'
					}
				]
			},
			term_cond : {
				identifier  : 'term_cond',
				rules: [
					{
						type   : 'checked',
						prompt : 'Por favor, debes indicar que aceptas los términos y condiciones de uso.'
					}
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

	/* Se oculta el mensaje de control de acceso */
	$scope.msj_error=false;

	/* Funcion de validacion del formulario de acceso */
	$scope.check = function(paciente) { 

		var pacienteConectado;

		/* Se hace LogIn con los datos que ha introducido en el formulario el paciente */
		Paciente.LogIn(paciente).then(function(data){
			pacienteConectado=Object.values(data.data);

			/* Si existe el paciente en cuestion, se reconduce a su pagina de resultados */
			if (pacienteConectado!=null) {
				$scope.msj_error=false;

				/* Si se trata de un psicologo */
				if(data.data.formacion!=null){
					$location.path("/mail"); /* Se redirige a la pagina de la bandeja de entrada */
				} else { /* Si es un paciente */
					$location.path("/usuarios"); /* Se redirige a la pagina de perfil */
				}
			}

		});

		/* Se avisa de que los datos no son correctos */
		$scope.msj_error=true;	
	}

	/* Funcion check que valida el cuestionario de registro */
	$scope.registrar = function(paciente) { 
		/* Indicamos que se esta tratando de enviar */
		$scope.isSubmitting = true;

		/* Si el formulario de registro se ha validado correctamente */
		if($('#register_form').form('is valid')) {

			/* Se guarda el objeto paciente del formulario */
			Paciente.SignUp({
				email: paciente.email,
				password: paciente.password,
				genero: paciente.genero,
				edad: edad,
				localizacion: place.name,
				telefono: paciente.telefono            
			}).then(function(){ /* Seguidamente */
				/* Se redirecciona al perfil del paciente */
				$location.path("/usuarios");
			}); 	
		}
	}
});