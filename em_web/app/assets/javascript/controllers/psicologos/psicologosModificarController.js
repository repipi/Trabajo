angular.module('Emozio').controller('PsicologosModificarController', function(Paciente, Psicologo, $scope, $routeParams, $location, $window){

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

	/************************************************************************************************************************** Validacion de formularios **********************************************************************************************************************************/

	/* Validacion de formulario de registro - Parte 2 */
	$('#register_form_2').form({
		on : 'blur', /* Cada elemento se evalua por separado */
		inline: 'true', /* Los mensajes de validacion se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			nombre : {
				identifier : 'nombre',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce tu nombre.'
					},
					{
						type : 'regExp[^[a-zA-ZÀ-ÿ\u00f1\u00d1 ,.;:¿?¡!()]+$]',
						prompt : 'El formato del nombre es incorrecto.'
					},
					{
						type: 'maxLength[50]',
						prompt : 'Demasiados carácteres.'
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
					//					,
					//					{
					//						type : 'integer[18..100]',
					//						prompt : 'Debe ser mayor de edad.'
					//					}
				]
			},
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
						prompt : 'Demasiados carácteres.'
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

	/* Validacion de formulario de registro - Parte 3 */
	$('#register_form_3').form({
		on : 'blur', /* Cada elemento se evalua por separado */
		inline: 'true', /* Los mensajes de validacion se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			ncolegiado : {
				identifier : 'ncolegiado',
				optional: true,
				rules : [
					{
						type: 'maxLength[15]',
						prompt : 'Demasiados carácteres.'
					}
				]
			},
			experiencia : {
				identifier : 'experiencia',
				optional: true,
				rules : [
					{
						type: 'maxLength[250]',
						prompt : 'Demasiados carácteres.'
					}
				]
			},
			formacion : {
				identifier : 'formacion',
				optional: true,
				rules : [
					{
						type: 'maxLength[250]',
						prompt : 'Demasiados carácteres.'
					}
				]
			},
			terapia : {
				identifier : 'terapia',
				optional: true,
				rules : [
					{
						type: 'maxLength[250]',
						prompt : 'Demasiados carácteres.'
					}
				]
			},
			patologias : {
				identifier : 'patologias',
				optional: true,
				rules : [
					{
						type: 'maxLength[50]',
						prompt : 'Demasiados carácteres.'
					}
				]
			}
		}
	}); 

	/********************************************************************************************************************************** Formulario de registro **********************************************************************************************************************************/

	/* Se establecen las vistas al cargar la pagina */
	if ($scope.paso_2 == null && $scope.paso_3 == null) {
		$scope.msj_exito = false; /* Se oculta el mensaje de exito */
		$scope.paso_2 = true; /* Se muestra el paso 2 */
		$scope.paso_3 = false; /* Se oculta el paso 3 */
		$scope.estado_2 = 'active';	/* Se muestra el panel del estado 2 */
	}

	/* Cambiar paso */
	$scope.changeStep = function (psicologo) { 

		if ($scope.paso_2 == false && $scope.paso_3 == false) { /* Si estamos en el paso 1 */

			$scope.paso_2 = true; /* Pasamos al paso 2 */
			$scope.paso_3 = false;
			$scope.estado_2 = 'active';

		} else if ($scope.paso_2 == true && $scope.paso_3 == false) { /* Si estamos en el paso 2 */

			$scope.paso_2 = false;
			$scope.paso_3 = true; /* Pasamos al paso 3 */
			$scope.estado_2 = 'disabled';
			$scope.estado_3 = 'active';

		} else if ($scope.paso_2 == false && $scope.paso_3 == true) { /* Si estamos en el paso 3 */

			/* Ocultamos todos los pasos */
			$scope.paso_2 = false;
			$scope.paso_3 = false;
			$scope.estado_2 = 'disabled';
			$scope.estado_3 = 'disabled';

			/* Establecemos la informacion del psicologo */
			var infoPsicologo = {
				nombre: psicologo.nombre,
				genero : psicologo.genero,
				edad: edad,
				email : psicologo.email,
				localizacion: place.name,
				telefono : psicologo.telefono,
				ncolegiado : psicologo.ncolegiado,
				experiencia : psicologo.experiencia,
				formacion : psicologo.formacion,
				terapia : psicologo.terapia,
				especialidad : psicologo.especialidad,
				patologias : psicologo.patologias
			};

			/* "Damos de alta al psicologo" */
			Psicologo.SignUp(infoPsicologo);

			/* Se muestra un mensaje de exito */
			$scope.msj_exito = true;

		}

	}  

	/* Funcion de darse de baja */
	$scope.baja=function(){
		Psicologo.DarBaja(); /* Se da de baja al psicologo */
		$location.path("inicio");  /* Se redirige a la pagina de inicio */
		$window.location.reload(); /* Se recarga la pagina */
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Psicologo.Salir(); /* Se cierra la sesion del psicologo */
		$location.path("inicio"); /* Se redirige a la pagina de inicio */
		$window.location.reload();  /* Se recarga la pagina actual */
	}

});