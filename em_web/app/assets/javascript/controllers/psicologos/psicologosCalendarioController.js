angular.module('Emozio').controller('PsicologosCalendarioController', function(Psicologo, Mensaje, $scope, $routeParams, $location, $window){

	/* Recuperamos al psicologo */
	Psicologo.GetById().then(function(data){
		if(!data.data || data.data=='') {
			$location.path("/");
		} else {
			$scope.psicologo=Object.values(data.data)[0];
			$scope.nav_acceso=false;
			$scope.nav_psico=true;
			$scope.nav_gen=false;
		}
	});

	var citas = [];
	Mensaje.GetMsjAceptPsico().then(function(data) {
		$scope.mensajesAceptados=Object.values(data.data);

		for(var i=0, l=$scope.mensajesAceptados.length; i<l; i++) {

			var fecha = $scope.mensajesAceptados[i].mensajePsicologo.fechaCita.split(";");
			var formato = fecha[0].split('/');
			var fechaCita = formato[2] + '-' + formato[1] + '-' + formato[0] + 'T' + fecha[1].slice(2);

			//			var cita = JSON.parse('{ "title" : "' + $scope.mensajesAceptados[i].paciente.email + '", "start" : "' + fechaCita + '"}');
			var cita = {
				title :  $scope.mensajesAceptados[i].paciente.email,
				start : fechaCita
			};

			console.log(JSON.stringify(cita));

			citas.push(cita);
		}
	});

	$scope.eventSources = [];
	$scope.eventSources.push({
		color: '#f0f',
		events: citas
	});

	$('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,basicWeek,basicDay'
		},
		firstDay : 1, /* Empieza el lunes */
		dayNames : ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		dayNamesShort : ['Dom', 'Lun.', 'Mart.', 'Miérc.', 'Juev.', 'Vier.', 'Sáb.'],
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
		navLinks: true, // can click day/week names to navigate views
		editable: true,
		eventLimit: true,
		eventSources: $scope.eventSources
	});

	//	for(var i=0, l=citas.length; i<l; i++) {
	//		$("#calendar").fullCalendar( 'addEventSource', citas[i] );
	//	}

	/* Funcion salir que cierra la sesion */
	$scope.salir=function(){
		Psicologo.Salir();
		$location.path("inicio"); 
	}

});