angular.module('Emozio').controller('PsicologosModificarController', function(Paciente, Psicologo, $scope, $routeParams, $location, $window){

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

	/************************************************************************************************************************** Validacion de formularios **********************************************************************************************************************************/

	/* Validacion de formulario de registro */
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

	/* Se establecen las vistas */
	if ($scope.paso_2 == null && $scope.paso_3 == null) {
		$scope.msj_exito = false;
		$scope.paso_2 = true;
		$scope.paso_3 = false;
		$scope.estado_2 = 'active';		
	}

	/* Cambiar paso */
	$scope.changeStep = function (psicologo) { 

		if ($scope.paso_2 == false && $scope.paso_3 == false) {

			//if(!$('#register_form_2').form('is valid')&&!$('#register_form_3').form('is valid')){

			$scope.paso_2 = true;
			$scope.paso_3 = false;
			$scope.estado_2 = 'active';

			//			} else {
			//
			//				$scope.paso_1 = true;
			//				$scope.paso_2 = false;
			//				$scope.paso_3 = false;
			//
			//			}

		} else if ($scope.paso_2 == true && $scope.paso_3 == false) {

			//			if($('#register_form_2').form('is valid')&&!$('#register_form_3').form('is valid')){


			$scope.paso_2 = false;
			$scope.paso_3 = true;
			$scope.estado_2 = 'disabled';
			$scope.estado_3 = 'active';

			//			} else {
			//
			//				$scope.paso_2 = true;
			//				$scope.paso_3 = false;
			//				$scope.estado_2 = 'active';
			//			}

		} else if ($scope.paso_2 == false && $scope.paso_3 == true) {

			//			if($('#register_form_2').form('is valid')&&$('#register_form_3').form('is valid')){

			$scope.paso_2 = false;
			$scope.paso_3 = false;
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
			//			}

		}

	}  

	/* Funcion de darse de baja */
	$scope.baja=function(){
		Psicologo.DarBaja();
		$location.path("inicio"); 
		$window.location.reload();
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Psicologo.Salir();
		$location.path("inicio"); 
	}

});