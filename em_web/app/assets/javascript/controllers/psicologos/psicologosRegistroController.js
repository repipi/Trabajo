angular.module('Emozio').controller('PsicologosRegistroController', function(Paciente, Psicologo, $scope, $routeParams, $location){

	/* Recuperamos al paciente para comprobar que tiene la sesion iniciada */
	Paciente.GetById().then(function(data){
		if(!data.data) {  /* Si el paciente no ha iniciado la sesion, no se obtendra */
			/* Validacion de formulario de registro */
			$('#access_form').form({
				on : 'blur', /* Cada elemento se evalua por separado */
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
							}
						]
					},      
					password: {
						identifier: 'password',
						rules: [
							{
								type: 'empty',
								prompt: 'Por favor, introduce una contraseña.'
							}
						]
					}
				}
			}); 
		} else { /* Si no */
			$location.path("/inicio"); /* Se redirige a la pagina de inicio */
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

	var edad; /* Edad del paciente */

	/* Se genera el calendario */
	$('#edad').calendar({
		type: 'date', /* El tipo es una fecha */
		onChange: function (date, text) { /* Cuando se rellena el campo */
			edad = text; /* Se establece que la edad es el contenido */
		}
	});

	/************************************************************************************************************************** Validacion de formularios **********************************************************************************************************************************/

	/* Validacion de formulario de acceso */
	$('#access_form').form({
		on : 'blur', /* Cada elemento se evalua por separado */
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
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce el número de colegiado.'
					},
					{
						type: 'maxLength[15]',
						prompt : 'Demasiados carácteres.'
					}
				]
			},
			experiencia : {
				identifier : 'experiencia',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce tu experiencia.'
					},
					{
						type: 'maxLength[250]',
						prompt : 'Demasiados carácteres.'
					}
				]
			},
			formacion : {
				identifier : 'formacion',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce tu formación.'
					},
					{
						type: 'maxLength[250]',
						prompt : 'Demasiados carácteres.'
					}
				]
			},
			terapia : {
				identifier : 'terapia',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce las terapias que empleas.'
					},
					{
						type: 'maxLength[250]',
						prompt : 'Demasiados carácteres.'
					}
				]
			},
			patologias : {
				identifier : 'patologias',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce las patologías que tratas.'
					},
					{
						type: 'maxLength[50]',
						prompt : 'Demasiados carácteres.'
					}
				]
			}
		}
	}); 

	/**********************************************************************************************************************************Formulario de acceso **********************************************************************************************************************************/

	/* Se establece el mensaje de control de acceso */
	$scope.msj_error=false;

	/* Funcion de validacion del formulario de acceso */
	$scope.check = function(paciente) { 

		var pacienteConectado;

		/* Se hace LogIn con los datos que ha introducido en el formulario el paciente */
		Paciente.LogIn(paciente).then(function(data){
			pacienteConectado=Object.values(data.data);

			/* Si existe el paciente en cuestion, se reconduce a su pagina de resultados */
			if (pacienteConectado!=null) {
				$scope.msj_error=false; /* Se oculta el mensaje de error */

				/* Si se trata de un psicologo */
				if(data.data.formacion!=null){
					$location.path("/mail"); /* Se redirige a la pagina de la bandeja de entrada */
				} else { /* Si es un paciente */
					$location.path("/usuarios"); /* Se redirige a la pagina de perfil del paciente */
				}
			} 

		});

		/* Se avisa de que los datos no son correctos */
		$scope.msj_error=true;	
	}
	/**********************************************************************************************************************************Formulario de registro **********************************************************************************************************************************/

	/* Se establecen las vistas al cargar la pagina */
	if ($scope.paso_1 == null && $scope.paso_2 == null && $scope.paso_3 == null) {
		$scope.msj_exito = false; /* Se oculta el mensaje de exito */
		$scope.paso_1 = true; /* Se muestra el paso 1 */
		$scope.paso_2 = false; /* Se oculta el paso 2 */
		$scope.paso_3 = false; /* Se oculta el paso 3 */
		$scope.estado_1 = 'active';	/* Se muestra el panel del estado 1 */
	}

	/* Cambiar paso */
	$scope.changeStep = function (psicologo) { 

		if ($scope.paso_1 == true && $scope.paso_2 == false && $scope.paso_3 == false) { /* Si estamos en el paso 1 */

			/* Si el formulario de registro de la parte 2 y 3 no estan validadas */
			if(!$('#register_form_2').form('is valid')&&!$('#register_form_3').form('is valid')){

				$scope.paso_1 = false;
				$scope.paso_2 = true; /* Pasamos al paso 2 */
				$scope.paso_3 = false;
				$scope.estado_1 = 'disabled';
				$scope.estado_2 = 'active';

			} else {

				$scope.paso_1 = true; /* Permanecemos en el paso 1 */
				$scope.paso_2 = false;
				$scope.paso_3 = false;
				$scope.estado_1 = 'active';	

			}

		} else if ($scope.paso_1 == false && $scope.paso_2 == true && $scope.paso_3 == false) { /* Si estamos en el paso 2 */

			/* Si el formulario de registro de la parte 2 esta validada, y la 3 no */
			if($('#register_form_2').form('is valid')&&!$('#register_form_3').form('is valid')){

				$scope.paso_1 = false;
				$scope.paso_2 = false;
				$scope.paso_3 = true; /* Pasamos al paso 3 */
				$scope.estado_1 = 'disabled';
				$scope.estado_2 = 'disabled';
				$scope.estado_3 = 'active';

			} else {

				$scope.paso_1 = false;
				$scope.paso_2 = true; /* Permanecemos en el paso 2 */
				$scope.paso_3 = false;
				$scope.estado_1 = 'disabled';
				$scope.estado_2 = 'active';

			}

		} else if ($scope.paso_1 == false && $scope.paso_2 == false && $scope.paso_3 == true) { /* Si estamos en el paso 3 */

			/* Si el formulario de registro de la parte 2 y 3 estan validadas */
			if($('#register_form_2').form('is valid')&&$('#register_form_3').form('is valid')){

				/* Ocultamos todos los pasos */
				$scope.paso_1 = false;
				$scope.paso_2 = false;
				$scope.paso_3 = false;
				$scope.estado_1 = 'disabled';
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

	}  

});