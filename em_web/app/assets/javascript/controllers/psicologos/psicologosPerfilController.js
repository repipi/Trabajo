angular.module('Emozio').controller('PsicologosPerfilController', function(Psicologo, Paciente, $scope, $routeParams, $location, $window){

	/* Activamos el rating */
	var valoracion = 0;
	$(".rating").rating({
		initialRating: 0,
		maxRating: 5,
		onRate: function (rating) {
			valoracion = rating;
		}
	});

	/* Tomamos al psicologo indicado en los parametros */
	var comentarios = [];
	$scope.comentarios = [];
	$scope.paginas = [];
	var numPag=0;
	Psicologo.GetByParams($routeParams.id).then(function(data){
		$scope.psicologo=Object.values(data.data)[0];
		comentarios = $scope.psicologo.comentarios;

		for(var i=0, l=4; i<l; i++){
			$scope.comentarios.push(comentarios[i]);
		}

		for(var i=0, l=comentarios.length; i<l; i+=4){
			numPag++;
			$scope.paginas.push(numPag);
		}
	});

	$scope.iniciarRating = function(val){
		$(".valoraciones").rating({
			initialRating: val,
			maxRating: 5
		});

		/* Ponemos las valoraciones de solo lectura */
		$(".valoraciones").rating('disable');
	}

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
					//$scope.psicologo=Object.values(data.data)[0];
					$scope.nav_acceso=false;
					$scope.nav_psico=true;
					$scope.nav_gen=false;
				}
			});
		} else {
			$scope.nav_acceso=false;
			$scope.nav_gen=true;

			$scope.paciente = Object.values(data.data)[0];
		}
	});

	/* Funcion que muestra un rango de comentarios */
	$scope.mostrarComentarios = function(numero) {
		$scope.comentarios=[];
		for(var i=(numero-1)*4, l=numero*4; i<l; i++) {
			$scope.comentarios.push(comentarios[i]);
		}
	}

	/* Funcion que muestra u oculta el formulario de respuesta del psicologo. Por defecto, oculto */
	//	$scope.formRespuesta=false;
	$scope.actFormRespuesta = function(estado) {
		console.log("formRespuesta : "+ estado);
		if(estado==false){
			$scope.formRespuesta=true;
		} else {
			$scope.formRespuesta=false;
		}
	}

	/* Funcion que envia la respuesta del psicologo al comentario */
	$scope.enviarRespuesta = function(comentario, respuesta){

		comentario.fechaRespuesta = "hoy";
		comentario.respuesta = respuesta;

		for(var i=0, l=$scope.comentarios; i<l; i++){
			if($scope.comentarios[i].fechaComentario==comentario.fechaComentario && $scope.comentarios[i]._idPaciente==comentario._idPaciente){
				$scope.psicologo.comentarios.splice(i, 1);
			}
		}

		$scope.psicologo.comentarios.push(comentario);

		Psicologo.Comentar($scope.psicologo);

	}

	/* Funcion que añade un comentario al array de comentarios del psicologo */
	$scope.enviarComentario = function(comentario){

		if (comentario!=null) {
			var fecha = new Date();

			comentario.fechaComentario = fecha.getDate() + "/" + (fecha.getMonth() +1) + "/" + fecha.getFullYear() + "; " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
			comentario._idPaciente = $scope.paciente._id;
			comentario._idComentario = comentario.fechaComentario + comentario._idPaciente;
			console.log(comentario);
			
			comentario.valoracion = valoracion;

			$scope.psicologo.comentarios.push(comentario);

			Psicologo.Comentar($scope.psicologo);	

			/* Se muestra un mensaje de exito */
			$scope.msj_exito = true;
		}

	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.GetById().then(function(data){
			if(!data.data || data.data=='') {
				Psicologo.Salir();
			} else {
				Paciente.Salir();
			}
		});
		$location.path("inicio");
		/* Parche para cuando sales del perfil del psicologo */
		$window.location.reload(); 
	}

});