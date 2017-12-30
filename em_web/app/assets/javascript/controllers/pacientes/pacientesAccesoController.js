/* Las dependencias del controller son los argumentos de function */
angular.module('Emozio').controller('PacientesAccesoController', function(Paciente, Psicologo, $scope, $location, $window){

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
						prompt : 'Por favor, introduzca un e-mail.'
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
						prompt: 'Por favor, introduzca una contraseña.'
					}
				]
			}
		}
	}); 

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
					$scope.nav_acceso=false;
					$scope.nav_psico=true;
					$scope.nav_gen=false;
				}
			});
		} else {
			$scope.nav_acceso=false;
			$scope.nav_gen=true;
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

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.GetById().then(function(data){
			$window.location.reload(); 
			if(!data.data || data.data=='') {
				Psicologo.Salir();
			} else {
				Paciente.Salir();
			}
		});
	}
});