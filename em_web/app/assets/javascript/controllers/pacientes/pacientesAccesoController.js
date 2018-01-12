angular.module('Emozio').controller('PacientesAccesoController', function(Paciente, Psicologo, $scope, $location, $window){

	/* Se comprueba que el paciente ha iniciado la sesion */
	Paciente.GetById().then(function(data){ /* Recuperamos al paciente */
		if(!data.data || data.data=='') { /* Si el paciente no ha iniciado la sesion, no se obtendra */
			Psicologo.GetById().then(function(data){ /* Recuperamos al psicologo */
				if(!data.data || data.data=='') { /* Ni un psicologo ni un paciente ha iniciado la sesion */
					$scope.nav_acceso=true; /* Se muestra el menu de acceso */
					$scope.nav_psico=false; /* Se oculta el menu de psicologo */
					$scope.nav_gen=false; /* Se oculta el menu generico */
				} else { /* El psicologo ha iniciado la sesion */
					$scope.nav_acceso=false; /* Se oculta el menu de acceso */
					$scope.nav_psico=true; /* Se muestra el menu de psicologo */
					$scope.nav_gen=false; /* Se oculta el menu generico */
				}
			});
		} else { /* El paciente ha iniciado la sesion */
			$scope.nav_acceso=false; /* Se oculta el menu de acceso */
			$scope.nav_gen=true; /* Se muestra el menu generico */
		}
	});

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
						prompt : 'Por favor, introduzca un e-mail.'
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
						prompt: 'Por favor, introduzca una contraseña.'
					},
					{
						type: 'maxLength[50]',
						prompt: 'Demasiados carácteres.'
					}
				]
			}
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

			/* Si existe el paciente en cuestion, se reconduce a su pagina de resultados */
			if (pacienteConectado!=null) {
				$scope.msj_error=false; /* Se oculta el mensaje de error */

				/* Si se trata de un psicologo */
				if(data.data.formacion!=null){
					$location.path("/mail"); /* Se reconduce a su bandeja de entrada */
				} else { /* Si es un paciente */
					$location.path("/usuarios"); /* Se reconduce a su pagina de resultados */
				}
			}

		});

		/* Se avisa de que los datos no son correctos */
		$scope.msj_error=true;	
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		/* Se comprueba que el paciente ha iniciado la sesion */
		Paciente.GetById().then(function(data){ /* Se recupera al paciente */
			$window.location.reload(); /* Se recarga la pagina actual */
			if(!data.data || data.data=='') { /* Si no existe, se trata de un psicologo */
				Psicologo.Salir(); /* Se cierra la sesion del psicologo */
			} else { /* Si lo es */
				Paciente.Salir(); /* Se cierra la sesion del paciente */
			}
		});
	}
});