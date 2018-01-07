angular.module('Emozio').controller('PacientesPerfilController', function(Paciente, Psicologo, Mensaje, $scope, $location, $window){

	/* Obtenemos el paciente que ha iniciado la sesion */
	Paciente.GetById().then(function(data){
		if(!data.data || data.data == '') {
			$location.path("/");
		} else {
			$scope.paciente=Object.values(data.data)[0];
			//        console.log($scope.paciente);  
			$scope.psicologos=$scope.paciente.psicologos.slice();

			/* Si el paciente no tiene diagnostico, no existen resultados */
			if(!$scope.paciente.diagnostico.length){
				$scope.cuadro_mensajeResultados="jumbotron";
				$scope.mensajeResultados="No hay resultados actualmente";
			} else { /* Si el paciente tiene diagnostico */
				/* Pero al paciente no se le han asignado psicologos (los resultados no son concluyentes) */
				if(!$scope.psicologos.length){
					$scope.cuadro_mensajeResultados="jumbotron";
					$scope.mensajeResultados="Los resultados no han sido concluyentes";
				}
			}
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

	$scope.iniciarRating = function(val){
		$(".valoraciones").rating({
			initialRating: val,
			maxRating: 5
		});

		/* Ponemos las valoraciones de solo lectura */
		$(".valoraciones").rating('disable');
	}

	/* Funcion del boton "Hacer el test" */
	$scope.hacer=function(){
		/* Redireccionado al cuestionario */
		$location.path("cuestionario/" + 1); 
		$window.location.reload();
	}

	/* Funcion del boton "Filtrar" */
	$scope.filtrar = function(psicologo) { 

		var resultado = [];

		$scope.psicologos=$scope.paciente.psicologos.slice();

		if(psicologo){
			/* Se establece el tipo de consulta segun la seleccion del usuario */
			if(psicologo.consulta=="presencial"){
				psicologo.consulta.presencial=true;
			} else if (psicologo.consulta=="online"){
				psicologo.consulta.online=true;
			} else {
				psicologo.consulta="";
			}
		} else {
			psicologo.consulta="";
		}

		/* Si el paciente no tiene psicologos asignados, no se hace nada */
		if($scope.psicologos){

			/* Se filtra a los psicologos asignados al paciente en funcion de los datos obtenidos en el formulario */
			Psicologo.Filtrar(psicologo).then(function(data){
				var psicologosFiltrados=Object.values(data.data);

				/* Si se obtienen resultados: Hay coincidencias con los parametros escogidos */
				if(psicologosFiltrados.length){

					/* Se recorre el array de todos los psicologos */
					for(var i=0, l=psicologosFiltrados.length; i<l; i++){
						/* Si el psicologo en cuestion, no esta asignado al paciente, se elimina del array */
						for (var j=0, m=$scope.psicologos.length; j<m; j++){
							/* Si el psicologo que hemos obtenido se corresponde con uno de nuestro array. Se añade al array de resultados */
							if(psicologosFiltrados[i]._id==$scope.psicologos[j]._id){
								resultado.push($scope.psicologos[j]);
							}
						}
					}

					$scope.psicologos=resultado;

					//                    for(var k=0, n=$scope.psicologos.length; k<n; k++) {
					//                        console.log($scope.psicologos[k]);   
					//                    }

					if(!$scope.psicologos.length) {
						$scope.cuadro_mensaje="jumbotron";
						$scope.mensaje="No existen resultados para su búsqueda";
						$scope.psicologos=[];
					}

					$scope.cuadro_mensaje="";
					$scope.mensaje="";

				} 

				/* Si no se han obtenido resultados, se muestra un mensaje de aviso */
				if(!psicologosFiltrados.length) {
					$scope.cuadro_mensaje="jumbotron";
					$scope.mensaje="No existen resultados para su búsqueda";
					$scope.psicologos=[];
				}

			});
		} 

	}

	$scope.recuperarMisResultados = function() {
		/* Se recarga la pagina de resultados */
		$location.path("/usuarios");
		$scope.cuadro_mensaje="";
		$scope.mensaje="";
		$scope.psicologos=$scope.paciente.psicologos.slice();
	}

	//	$(document).on("click", "#contactar", function () {
	//		var psicologoId = $(this).data('id');
	//		console.log(psicologoId);
	//		$("#psicologoId").val(psicologoId);
	//	});

	/* Validacion de formulario de registro */
	$('#contacto_form').form({
		on : 'blur',
		inline: 'false',
		fields : {
			mensaje : {
				identifier : 'mensaje',
				rules : [
					{
						type : 'empty',
						prompt : 'Por favor, introduce un mensaje.'
					},
					{
						type: 'maxLength[500]',
						prompt: 'Demasiados carácteres.'
					}
				]
			},      
			preferencias: {
				identifier: 'preferencias',
				rules: [
					{
						type: 'empty',
						prompt: 'Por favor, introduce tus preferencias.'
					},
					{
						type: 'maxLength[300]',
						prompt: 'Demasiados carácteres.'
					}
				]
			}
		}
	}); 

	/* Establece cual es el psicologo que ha sido seleccionado */
	$scope.psicologo = {};
	$scope.psicologoSeleccionado = function(psicologo) {
		$scope.psicologo._id = psicologo._id;

		Psicologo.GetByParams($scope.psicologo._id).then(function(data){
			$scope.psicologo=Object.values(data.data)[0];
		});
	}

	$scope.msj_exito_contacto = false;
	$scope.enviarMensaje = function(mensaje) {

		if($('#contacto_form').form('is valid')) {

			var mensajeEnviado = {
				psicologo : {
					_id : $scope.psicologo._id,
					nombre : $scope.psicologo.nombre,
					genero : $scope.psicologo.genero,
					edad : $scope.psicologo.edad,
					email : $scope.psicologo.email,
					telefono : $scope.psicologo.telefono,
					localizacion : $scope.psicologo.localizacion,
					foto : $scope.psicologo.foto
				},
				texto : mensaje.texto,
				preferencias : mensaje.preferencias
			}

			Mensaje.SendMsg(mensajeEnviado);

			$scope.msj_exito_contacto = true;

			setTimeout(function(){
				$location.path("/usuarios"); 
				$window.location.reload();
			}, 1000);

		}
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.Salir();
		$location.path("inicio"); 
	}
});