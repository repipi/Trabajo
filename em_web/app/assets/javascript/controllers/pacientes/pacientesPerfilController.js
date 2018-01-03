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
				$scope.cuadro_mensaje="jumbotron";
				$scope.mensaje="No hay resultados actualmente";
			} else { /* Si el paciente tiene diagnostico */
				/* Pero al paciente no se le han asignado psicologos (los resultados no son concluyentes) */
				if(!$scope.psicologos.length){
					$scope.cuadro_mensaje="jumbotron";
					$scope.mensaje="Los resultados no han sido concluyentes";
				}
			}
		}

	});

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

	$scope.enviarMensaje = function(mensaje) {
		var fecha = new Date();
		mensaje.fecha = fecha.getDate() + "/" + (fecha.getMonth() +1) + "/" + fecha.getFullYear() + "; " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
		mensaje._idPsicologo = "5a0c11f3665533169c64fa54";
		console.log(mensaje);
		
		Mensaje.SendMsg(mensaje);
	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Paciente.Salir();
		$location.path("inicio"); 
	}
});