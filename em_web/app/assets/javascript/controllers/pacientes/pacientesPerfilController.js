angular.module('Emozio').controller('PacientesPerfilController', function(Paciente, Psicologo, Mensaje, $scope, $location, $window){

	/* Obtenemos el paciente que ha iniciado la sesion */
	Paciente.GetById().then(function(data){ /* Recuperamos al paciente */
		if(!data.data || data.data == '') { /* Si el paciente no ha iniciado la sesion, no se obtendra */
			$location.path("/"); /* Se redirige a la pagina de inicio */
		} else {
			$scope.paciente=Object.values(data.data)[0];
			/* Se recuperan los psicologos del paciente */
			$scope.psicologos=$scope.paciente.psicologos.slice();

			/* Si el paciente no tiene diagnostico, no existen resultados */
			if(!$scope.paciente.diagnostico.length){
				/* Se muestra un mensaje de aviso */
				$scope.cuadro_mensajeResultados="jumbotron";
				$scope.mensajeResultados="No hay resultados actualmente";
			} else { /* Si el paciente tiene diagnostico */
				/* Pero al paciente no se le han asignado psicologos (los resultados no son concluyentes) */
				if(!$scope.psicologos.length){
					/* Se muestra un mensaje de aviso */
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
		/* Se recarga la pagina actual */
		$window.location.reload();
	}

	/* Funcion del boton "Filtrar" */
	$scope.filtrar = function(psicologo) { 

		var resultado = []; /* Array de psicologos del resultado del filtro */

		$scope.psicologos=$scope.paciente.psicologos.slice(); /* Se guardan los psicologos del paciente */

		/* Si se pasan los datos para filtrar */
		if(psicologo){
			/* Se establece el tipo de consulta segun la seleccion del usuario */
			if(psicologo.consulta=="presencial"){ /* Si la consulta es presencial */
				psicologo.consulta.presencial=true; /* Se marca consulta.presencial como true */
			} else if (psicologo.consulta=="online"){ /* Si la consulta es online */
				psicologo.consulta.online=true; /* Se marca consulta.online como true */
			} else { /* Si no, la consulta se establece como nula */
				psicologo.consulta="";
			}
		} else { /* Si no, la consulta se establece como nula */
			psicologo.consulta="";
		}

		/* Si el paciente no tiene psicologos asignados, no se hace nada */
		if($scope.psicologos){
			
			/* Se filtra a los psicologos asignados al paciente en funcion de los datos obtenidos en el formulario */
			Psicologo.Filtrar(psicologo).then(function(data){
				var psicologosFiltrados=Object.values(data.data);

				console.log(psicologosFiltrados);
				
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

					/* Los psicologos a mostrar son los obtenidos del filtrado */
					$scope.psicologos=resultado;

					/* Si no se han obtenido psicologos en la busqueda */
					if(!$scope.psicologos.length) {
						/* Se muestra un aviso */
						$scope.cuadro_mensaje="jumbotron";
						$scope.mensaje="No existen resultados para su búsqueda";
						/* Los psicologos mostrados se resetean */
						$scope.psicologos=[];
					}

					/* En cualquier otro caso, no aparece el aviso */
					$scope.cuadro_mensaje="";
					$scope.mensaje="";

				} 

				/* Si no se han obtenido resultados, se muestra un mensaje de aviso */
				if(!psicologosFiltrados.length) {
					$scope.cuadro_mensaje="jumbotron";
					$scope.mensaje="No existen resultados para su búsqueda";
					/* Los psicologos mostrados se resetean */
					$scope.psicologos=[];
				}

			});
		} 

	}

	/* Funcion que recupera los resultados totales de los psicologos asignados en el test de asignacion */
	$scope.recuperarMisResultados = function() {
		/* Se recarga la pagina de resultados */
		$location.path("/usuarios");
		/* Se ocultan los avisos */
		$scope.cuadro_mensaje="";
		$scope.mensaje="";
		/* Se establece que los psicologos sean los que contiene el paciente */
		$scope.psicologos=$scope.paciente.psicologos.slice();
	}

	/* Validacion de formulario de contacto */
	$('#contacto_form').form({
		on : 'blur', /* Cada elemento se evalua por separado */
		inline: 'false', /* Los mensajes de validacion no se disponen en linea */
		/* Campos a validar: Identificador y reglas a evaluar */
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

	$scope.psicologo = {}; /* Psicologo seleccionado */
	/* Funcion que establece cual es el psicologo que ha sido seleccionado */
	$scope.psicologoSeleccionado = function(psicologo) {
		$scope.psicologo._id = psicologo._id;

		/* Obtenemos el psicologo pasado por parametros */
		Psicologo.GetByParams($scope.psicologo._id).then(function(data){
			$scope.psicologo=Object.values(data.data)[0];
		});
	}

	/* Se oculta el mensaje de exito del contacto */
	$scope.msj_exito_contacto = false;

	/* Funcion que envia un mensaje al psicologo de parte del paciente */
	$scope.enviarMensaje = function(mensaje) {

		/* Si la validacion del formulario de contacto es correcta */
		if($('#contacto_form').form('is valid')) {

			/* Se guarda la informacion del mensaje que se va a enviar */
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
				preferencias : mensaje.preferencias,
				consulta : mensaje.consulta
			}

			/* Se guarda el mensaje enviado */
			Mensaje.SendMsg(mensajeEnviado);

			/* Se muestra un mensaje de exito */
			$scope.msj_exito_contacto = true;

			/* Tras un segundo, la ventana se recarga: Desaparece el modal */
			setTimeout(function(){
				$location.path("/usuarios"); /* Se redirige al perfil del paciente */
				$window.location.reload(); /* Se recarga la pagina actual */
			}, 1000);

		}
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.Salir(); /* Se cierra la sesion del paciente */
		$location.path("inicio"); /* Se redirige a la pagina de inicio */
		$window.location.reload();  /* Se recarga la pagina actual */
	}
});