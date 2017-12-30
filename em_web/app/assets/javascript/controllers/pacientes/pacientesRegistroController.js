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

	/* Validacion de formulario de registro */
	$('#register_form').form({
		on : 'blur',
		inline: 'true',
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
					}, 
					{
						type: 'regExp[^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$]',
						prompt: 'La contraseña debe contener al menos una minúscula, una mayúscula y un dígito.'
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

	/* Edad paciente */
	var edad;

	$('#edad').calendar({
		type: 'date',
		onChange: function (date, text) {
			edad = text;
		}
	});

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

	/* Funcion check que valida el cuestionario de registro */
	$scope.registrar = function(paciente) { 
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

		//		console.log(nuevoPaciente);

		if($('#register_form').form('is valid')) {
			/* Se guarda el objeto paciente del formulario. Despues, */
			Paciente.SignUp(paciente).then(function(){
				/* Se redirecciona al perfil del paciente */
				$location.path("/usuarios");
			}); 	
		}
	}
});