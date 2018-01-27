angular.module('Emozio').controller('PsicologosPerfilController', function(Psicologo, Paciente, $scope, $routeParams, $location, $window){

	/* Se comprueba que el paciente ha iniciado la sesion */
	Paciente.GetById().then(function(data){ /* Recuperamos al paciente */
		if(!data.data || data.data=='') {  /* Si el paciente no ha iniciado la sesion, no se obtendra */
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

			$scope.paciente = Object.values(data.data)[0]; 
		}
	});

	/* Activamos el rating */
	var valoracion = 0;
	$(".rating").rating({
		initialRating: 0,
		maxRating: 5,
		onRate: function (rating) {
			valoracion = rating;
		}
	});

	/* Comentarios del psicologo */
	//	var comentarios = []; 
	$scope.comentarios = [];
	//	$scope.paginas = []; /* Lista de paginas de los comentarios */
	//	var numPag=0; /* Numero de pagina de los comentarios */

	/* Tomamos al psicologo indicado en los parametros */
	Psicologo.GetByParams($routeParams.id).then(function(data){
		$scope.psicologo=Object.values(data.data)[0];
		$scope.comentarios = $scope.psicologo.comentarios;
		//		comentarios = $scope.psicologo.comentarios;

		//		/* Se mostraran los primeros 4 comentarios del psicologo */
		//		for(var i=0, l=4; i<l; i++){
		//			$scope.comentarios.push(comentarios[i]);
		//		}

		/* Por cada 4 comentarios, el numero de pagina se incrementa a 1 */
		//		for(var i=0, l=comentarios.length; i<l; i+=4){
		//			numPag++;
		//			$scope.paginas.push(numPag); /* El numero de pagina en cuestion se añade a la lista de numeros de paginas */
		//		}

	});

	/* Validacion del formulario para responder */
	$('#responder_form').form({
		on : 'blur', /* Cada elemento se evalua por separado */
		inline: 'false', /* Los mensajes de validacion no se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			comentario : {
				identifier : 'comentario',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce un comentario.'
					},
					{
						type: 'maxLength[500]',
						prompt: 'Demasiados carácteres.'
					}
				]
			}
		}
	}); 

	/* Validacion del formulario para comentar */
	$('#comentar_form').form({
		on : 'blur', /* Cada elemento se evalua por separado */
		inline: 'false', /* Los mensajes de validacion no se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
		fields : {
			comentario : {
				identifier : 'comentario',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce un comentario.'
					},
					{
						type: 'maxLength[500]',
						prompt: 'Demasiados carácteres.'
					}
				]
			}
		}
	}); 

	$scope.iniciarRating = function(val){
		console.log(val);

		$(".valoraciones").rating({
			initialRating: val,
			maxRating: 5
		});

		/* Ponemos las valoraciones de solo lectura */
		$(".valoraciones").rating('disable');
	}

	/* Funcion que muestra un rango de comentarios */
	$scope.mostrarComentarios = function(numero) {
		$scope.comentarios=[];

		/* Se muestra el rango de comentarios entre el numero seleccionao y los 4 siguientes */
		for(var i=(numero-1)*4, l=numero*4; i<l; i++) {
			$scope.comentarios.push(comentarios[i]); /* Se añaden los comentarios en cuestion en el array */
		}
	}

	$scope.comentario = {}; /* Comentario seleccionado */
	/* Establece cual es el comentario que ha sido seleccionado */
	$scope.comentarioSeleccionado = function(comentario) {
		/* Para cada comentario del array de comentarios del psicologo */
		for(var i=0, l=$scope.psicologo.comentarios.length; i<l; i++) { 
			/* Si el identificador del comentario coincide con el del comentario seleccionado */
			if($scope.psicologo.comentarios[i]._idComentario == comentario._idComentario) {
				/* Se guarda el comentario en cuestion como el mostrado */
				$scope.comentario = comentario;
			}
		}
	}

	/* Funcion que envia la respuesta del psicologo al comentario seleccionado */
	$scope.enviarRespuesta = function(comentario, respuesta){

		if($('#responder_form').form('is valid')) {

			console.log(comentario);

			/* Se formatea la fecha de hoy */
			var fecha = new Date();
			comentario.fechaRespuesta =  ("0" + fecha.getDate()).slice(-2) + "/" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "/" + fecha.getFullYear() + "; " + (fecha.getHours()<10?'0':'') + fecha.getHours() + ":" + (fecha.getMinutes()<10?'0':'') + fecha.getMinutes() + ":" + (fecha.getSeconds()<10?'0':'') + fecha.getSeconds();
			/* Se establece la respuesta al comentario */
			comentario.respuesta = respuesta;

			for(var i=0, l=$scope.comentarios; i<l; i++){
				if($scope.comentarios[i].fechaComentario==comentario.fechaComentario && $scope.comentarios[i]._idPaciente==comentario._idPaciente){
					//$scope.psicologo.comentarios.splice(i, 1);
					$scope.psicologo.comentarios[i] = comentario;
				}
			}

			/* Se añade el comentario en el array de comentarios del psicologo */
			//$scope.psicologo.comentarios.push(comentario);

			/* Se guarda el comentario del psicologo */
			Psicologo.Comentar($scope.psicologo);

			/* Se muestra un mensaje de exito */
			$scope.msj_exito_respuesta = true;

			/* Tras un segundo, la ventana se recarga: Desaparece el modal */
			setTimeout(function(){
				$location.path("/mail"); /* Se redirige a la pagina de la bandeja de entrada */
				$window.location.reload(); /* Se recarga la pagina actual */
			}, 1000);

		}

	}

	/* Funcion que añade un comentario al array de comentarios del psicologo */
	$scope.enviarComentario = function(comentario){

		if($('#comentar_form').form('is valid')) {

			if (comentario!=null) { /* Si el comentario no es nulo */
				/* Se formatea la fecha de hoy */
				var fecha = new Date();
				comentario.fechaComentario =  ("0" + fecha.getDate()).slice(-2) + "/" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "/" + fecha.getFullYear() + "; " + (fecha.getHours()<10?'0':'') + fecha.getHours() + ":" + (fecha.getMinutes()<10?'0':'') + fecha.getMinutes() + ":" + (fecha.getSeconds()<10?'0':'') + fecha.getSeconds();
				/* Se establece el id del paciente, del comentario; y la valoracion */
				comentario._idPaciente = $scope.paciente._id;
				comentario._idComentario = comentario.fechaComentario + comentario._idPaciente;
				comentario.valoracion = valoracion;

				/* Se añade el comentario en el array de comentarios del psicologo */
				$scope.psicologo.comentarios.push(comentario);

				var mediaValoraciones = 0;
				for(var i=0, l=$scope.psicologo.comentarios.length; i<l; i++) {
					mediaValoraciones+=$scope.psicologo.comentarios[i].valoracion;
				}
				mediaValoraciones=mediaValoraciones/$scope.psicologo.comentarios.length;
				$scope.psicologo.estrellas=Math.round(mediaValoraciones);

				/* Se guarda el comentario del psicologo */
				Psicologo.Comentar($scope.psicologo);	

				/* Se muestra un mensaje de exito */
				$scope.msj_exito = true;

				$window.location.reload();  /* Se recarga la pagina actual */
			}
		}

	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		/* Se comprueba que el paciente ha iniciado la sesion */
		Paciente.GetById().then(function(data){  /* Se recupera al paciente */
			if(!data.data || data.data=='') { /* Si no existe, se trata de un psicologo */
				Psicologo.Salir();  /* Se cierra la sesion del psicologo */
			} else { /* Si lo es */
				Paciente.Salir(); /* Se cierra la sesion del paciente */
			}
		});
		$location.path("inicio"); /* Se redirige a la pagina de inicio */
		/* Parche para cuando sales del perfil del psicologo */
		$window.location.reload();  /* Se recarga la pagina actual */
	}

});