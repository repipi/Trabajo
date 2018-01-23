angular.module('Emozio').controller('PsicologosCalendarioController', function(Psicologo, Mensaje, $scope, $routeParams, $location, $window){

	/* Se comprueba que el psicologo ha iniciado la sesion */
	Psicologo.GetById().then(function(data){ /* Recuperamos al psicologo */
		if(!data.data || data.data=='') {  /* Si el psicologo no ha iniciado la sesion, no se obtendra */
			$location.path("/"); /* Se redirige a la pagina de inicio */
		} else {
			$scope.psicologo=Object.values(data.data)[0];
			$scope.nav_acceso=false; /* Se oculta el menu de acceso */
			$scope.nav_psico=true; /* Se muestra el menu del psicologo */
			$scope.nav_gen=false; /* Se oculta el menu generico */
		}
	});

	var citas = []; /* Citas del psicologo */
	$scope.mensaje = {}; /* Mensaje seleccionado */

	/* Se recuperan los mensajes aceptados por el psicologo */
	Mensaje.GetMsjAceptPsico().then(function(data) {
		$scope.mensajesAceptados=Object.values(data.data);

		/* Se instancia el calendario */
		$('#calendar').fullCalendar({
			header: { /* Opciones de la barra de herramientas */
				left: 'prev,next today', /* A la izquierda: Anterior, siguiente y hoy */
				center: 'title', /* En el centro: Nombre del mes */
				right: 'month,basicWeek,basicDay' /* A la derecha: Mes, semana y dia */
			},
			buttonText : { /* Nombre que aparece en las opciones de la barra de herramientas */
				today:    'hoy',
				month:    'mes',
				week:     'semana',
				day:      'día',
				prev:	  '<',
				next:	  '>'
			},
			firstDay : 1, /* Empieza el lunes */
			dayNames : ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], /* Nombres de los dias */
			dayNamesShort : ['Dom.', 'Lun.', 'Mart.', 'Miérc.', 'Juev.', 'Vier.', 'Sáb.'], /* Nombres abreviados de los dias */
			monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'], /* Nombres de los meses */
			monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], /* Nombres abreviados de los meses */
			navLinks: true, /* Permite navegar entre las distintas vistas: Mes, semana y dia */
			editable: true, /* Los eventos pueden ser modificados */
			eventLimit: true, /* Numero de eventos mostrados en un dia limitado */
			theme: true, /* Activa el tema */           
			themeSystem:'bootstrap3', /* Establece el tipo de tema */
			eventColor: '#ffffff', /* Establece el color del fondo de los eventos */
			eventTextColor: '#008080', /* Establece el color del texto de los eventos */
			//			eventClick: function (selectedEvent) { /* Funcion llamada al hacer click en un evento */
			//				$scope.mensaje = Object.values(selectedEvent.data)[0][0];
			//				
			//				$("#mensaje_mensajePaciente_fecha").html($scope.mensaje.mensajePaciente.fecha);
			//				$("#mensaje_mensajePaciente_texto").html($scope.mensaje.mensajePaciente.texto);
			//				$("#mensaje_mensajePaciente_preferencias").html($scope.mensaje.mensajePaciente.preferencias);
			//				$("#mensaje_mensajePsicologo_fecha").html($scope.mensaje.mensajePsicologo.fecha);
			//				$("#mensaje_mensajePsicologo_comentario").html($scope.mensaje.mensajePsicologo.comentario);
			//				$("#mensaje_mensajePsicologo_fechaCita").html($scope.mensaje.mensajePsicologo.fechaCita);
			//				$("#mensaje_paciente_email").html($scope.mensaje.paciente.email);
			//				$("#mensaje_paciente_telefono").html($scope.mensaje.paciente.telefono);
			//				$('#evento_modal').modal('show'); 
			//
			//			},
			eventClick: function (calEvent) {
				for(var i=0, l=$scope.mensajesCalendario.length; i<l; i++) {
					if(calEvent.start._i == $scope.mensajesCalendario[i].start) {
						console.log($scope.mensajesCalendario[i].start);

						$scope.mensaje=$scope.mensajesAceptados[i];

						$("#mensaje_mensajePaciente_fecha").html($scope.mensaje.mensajePaciente.fecha);
						$("#mensaje_mensajePaciente_texto").html($scope.mensaje.mensajePaciente.texto);
						$("#mensaje_mensajePaciente_preferencias").html($scope.mensaje.mensajePaciente.preferencias);
						$("#mensaje_mensajePsicologo_fecha").html($scope.mensaje.mensajePsicologo.fecha);
						$("#mensaje_mensajePsicologo_comentario").html($scope.mensaje.mensajePsicologo.comentario);
						$("#mensaje_mensajePsicologo_fechaCita").html($scope.mensaje.mensajePsicologo.fechaCita);
						$("#mensaje_paciente_email").html($scope.mensaje.paciente.email);
						$("#mensaje_paciente_telefono").html($scope.mensaje.paciente.telefono);
						$('#evento_modal').modal('show'); 
						break;
					}
				}
			},

			height: 600 /* Establece la altura del calendario */
		});

		/* Para cada mensaje aceptado, se manipula la disposicion de los datos para poder añadirlos como eventos */
		for (var i=0, l=$scope.mensajesAceptados.length; i<l; i++) {

			/* Se da formato a la fecha */
			var fecha = $scope.mensajesAceptados[i].mensajePsicologo.fechaCita.split(";");
			var formato = fecha[0].split('/');
			var fechaCita = formato[2] + '-' + formato[1] + '-' + formato[0] + 'T' + fecha[1].slice(2);

			/* Se crea el JSON cita con el formato de evento del calendario */
			var cita = {
				title :  $scope.mensajesAceptados[i].paciente.email,
				start : fechaCita,
				data: {
					evento : $scope.mensajesAceptados
				}
			};

			/* Se añade la cita al array de las citas del psicologo */
			citas.push(cita);
			/* Se renderiza el evento en cuestion del calendario */
			$('#calendar').fullCalendar('renderEvent', cita, true);
		}

		$scope.mensajesCalendario = [];
		for(var i=0, l=citas.length; i<l; i++){
			$scope.mensajesCalendario.push(citas[i]);
		}

		//		console.log($('#calendar').fullCalendar('clientEvents'));

	});

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Psicologo.Salir(); /* Se cierra la sesion del psicologo */
		$location.path("inicio"); /* Se redirige a la pagina de inicio */
		$window.location.reload();  /* Se recarga la pagina actual */
	}

});