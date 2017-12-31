angular.module('Emozio').controller('PacientesModificarController', function(Paciente, $scope, $location, $window){

	/* Obtenemos el paciente que ha iniciado la sesion */
	Paciente.GetById().then(function(data){
		if(!data.data || data.data=='') {
			$location.path("/");
		} else {
			$scope.paciente=Object.values(data.data)[0];
			//        console.log($scope.paciente);  
		}
	});

	$scope.msj_exito_datos=false;
	$scope.msj_error_datos=false;
	$scope.msj_exito_password=false;
	$scope.msj_error_password=false;

	/* Google Place API Web Service */
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

	/* Validacion de formulario de modificacion de datos */
	$('#change_form').form({
		on : 'blur',
		inline: 'true',
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
		on : 'blur',
		inline: 'true',
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

	/* Edad paciente */
	var edad;

	$('#edad').calendar({
		type: 'date',
		onChange: function (date, text) {
			edad = text;
		}
	});

	/* Funcion de cambio de datos del usuario */
	$scope.cambiarDatos = function(paciente) { 

		/* Indicamos que se esta tratando de enviar */
		$scope.isSubmitting = true;

		var nuevoPaciente = {
			email: paciente.email,
			password: paciente.password,
			genero: paciente.genero,
			edad: edad,
			localizacion: place.name,
			telefono: paciente.telefono            
		};
		//			console.log(nuevoPaciente);

		if($('#change_form').form('is valid')) {

			/* Se guarda el objeto paciente del formulario. Despues, */
			Paciente.Update({
				email: paciente.email,
				password: paciente.password,
				genero: paciente.genero,
				edad: edad,
				localizacion: place.name,
				telefono: paciente.telefono            
			}).then(function(data){
				if(data.data) {
					$scope.msj_exito_datos=true;	
					$scope.msj_error_datos=false;
				} else {
					$scope.msj_exito_datos=false;	
					$scope.msj_error_datos=true;
				}
			}); 

		}
	}

	/* Funcion de cambio de datos del usuario */
	$scope.cambiarPassword = function(paciente) { 

		/* Indicamos que se esta tratando de enviar */
		$scope.isSubmitting = true;

		console.log(paciente);

		if($('#password_form').form('is valid')) {

			/* Se guarda el objeto paciente del formulario. Despues, */
			Paciente.ChangePassword(paciente).then(function(data){
				if(data.data) {
					$scope.msj_exito_password=true;	
					$scope.msj_error_password=false;
				} else {
					$scope.msj_exito_password=false;	
					$scope.msj_error_password=true;
				}
			}); 

		}
	}

	/* Funcion de darse de baja */
	$scope.baja=function(){
		Paciente.DarBaja();
		$location.path("inicio"); 
		$window.location.reload();
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.GetById().then(function(data){
			if(!data.data || data.data=='') {
				Psicologo.Salir();
			} else {
				Paciente.Salir();
			}
			$location.path("inicio"); 
		});

	}
});