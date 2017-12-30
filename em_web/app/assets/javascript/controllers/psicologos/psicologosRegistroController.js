angular.module('Emozio').controller('PsicologosRegistroController', function(Paciente, Psicologo, $scope, $routeParams, $location){

	/* Recuperamos al paciente para comprobar que tiene la sesion iniciada */
	Paciente.GetById().then(function(data){
		if(!data.data) {
			/* Validacion de formulario de registro */
			$('#access_form').form({
				on : 'blur',
				inline: 'false',
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
		} else {
			$location.path("/inicio");
		}
	});

	/******************************************************************************************************************************* Google Place API Web Service *********************************************************************************************************************************/
	var autocomplete;   
	var place;

	$scope.initAutocomplete = function() {

		// Create the autocomplete object, restricting the search to geographical
		// location types.
		autocomplete = new google.maps.places.Autocomplete(
			/** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
			{ types: ['(cities)'],
			 componentRestrictions: {country: "es"}});

		// When the user selects an address from the dropdown, populate the address
		// fields in the form.
		autocomplete.addListener('place_changed', fillInAddress);

		function fillInAddress() {
			// Get the place details from the autocomplete object.
			place = autocomplete.getPlace();
		}
	}

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

	$("#autocomplete").focus(function() {
		$scope.geolocate();
	});

	/* Edad paciente */
	var edad;

	$('#edad').calendar({
		type: 'date',
		onChange: function (date, text) {
			edad = text;
		}
	});

	/************************************************************************************************************************** Validacion de formularios **********************************************************************************************************************************/

	/* Validacion de formulario de registro */
	$('#access_form').form({
		on : 'blur',
		inline: 'false',
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
	$('#register_form_2').form({
		on : 'blur',
		inline: 'true',
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

	$('#register_form_3').form({
		on : 'blur',
		inline: 'true',
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

			//			console.log("psico conectado");

			/* Si existe el paciente en cuestion, se reconduce a su pagina de resultados */
			if (pacienteConectado!=null) {
				$scope.msj_error=false;

				/* Si se trata de un psicologo */
				if(data.data.formacion!=null){
					$location.path("/mail");
				} else { /* Si es un paciente */
					$location.path("/usuarios");
				}
			}

		});

		/* Se avisa de que los datos no son correctos */
		$scope.msj_error=true;	
	}
	/**********************************************************************************************************************************Formulario de registro **********************************************************************************************************************************/

	/* Se establecen las vistas */
	if ($scope.paso_1 == null && $scope.paso_2 == null && $scope.paso_3 == null) {
		$scope.msj_exito = false;
		$scope.paso_1 = true;
		$scope.paso_2 = false;
		$scope.paso_3 = false;
		$scope.estado_1 = 'active';		
	}

	/* Cambiar paso */
	$scope.changeStep = function (psicologo) { 

		if ($scope.paso_1 == true && $scope.paso_2 == false && $scope.paso_3 == false) {

			if(!$('#register_form_2').form('is valid')&&!$('#register_form_3').form('is valid')){

				$scope.paso_1 = false;
				$scope.paso_2 = true;
				$scope.paso_3 = false;
				$scope.estado_1 = 'disabled';
				$scope.estado_2 = 'active';

			} else {

				$scope.paso_1 = true;
				$scope.paso_2 = false;
				$scope.paso_3 = false;
				$scope.estado_1 = 'active';	

			}

		} else if ($scope.paso_1 == false && $scope.paso_2 == true && $scope.paso_3 == false) {

			if($('#register_form_2').form('is valid')&&!$('#register_form_3').form('is valid')){

				$scope.paso_1 = false;
				$scope.paso_2 = false;
				$scope.paso_3 = true;
				$scope.estado_1 = 'disabled';
				$scope.estado_2 = 'disabled';
				$scope.estado_3 = 'active';

			} else {

				$scope.paso_1 = false;
				$scope.paso_2 = true;
				$scope.paso_3 = false;
				$scope.estado_1 = 'disabled';
				$scope.estado_2 = 'active';

			}

		} else if ($scope.paso_1 == false && $scope.paso_2 == false && $scope.paso_3 == true) {

			if($('#register_form_2').form('is valid')&&$('#register_form_3').form('is valid')){

				$scope.paso_1 = false;
				$scope.paso_2 = false;
				$scope.paso_3 = false;
				$scope.estado_1 = 'disabled';
				$scope.estado_2 = 'disabled';
				$scope.estado_3 = 'disabled';

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

				Psicologo.SignUp(infoPsicologo);

				$scope.msj_exito = true;
			}

		}

	}  

});