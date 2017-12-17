angular.module('Emozio').controller('PacientesPerfilController', function(Paciente, Psicologo, $scope, $location){

    /* Obtenemos el paciente que ha iniciado la sesion */
    Paciente.GetById().then(function(data){
        $scope.paciente=Object.values(data.data)[0];
        $scope.psicologos=$scope.paciente.psicologos;

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

    });

    /* Funcion del boton "Hacer el test" */
    $scope.hacer=function(){
        /* Redireccionado al cuestionario */
        $location.path("cuestionario/" + 1); 
    }

    /* Funcion del boton "Filtrar" */
    $scope.filtrar = function(psicologo) { 

        /* Se establece el tipo de consulta segun la seleccion del usuario */
        if(psicologo.consulta="presencial"){
            psicologo.consulta=JSON.parse('{ "online" : false, "presencial" : true}');
        } else if (psicologo.consulta=="online"){
            psicologo.consulta=JSON.parse('{ "online" : true, "presencial" : false}');
        } else {
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
                        if($scope.psicologos.indexOf(psicologosFiltrados[i])==-1){
                            psicologosFiltrados.splice(i, 1);
                        }
                    }
                    /* Si hay coincidencias para esos parametros */
                    if(psicologosFiltrados.length){
                        /* Se muestran los psicologos que han sido filtrados y pueden tratar al paciente */
                        $scope.psicologos=psicologosFiltrados;
                    } else { /* Si no se han obtenido resultados, se muestra un mensaje de aviso */
                        $scope.cuadro_mensaje="jumbotron";
                        $scope.mensaje="No existen resultados para su búsqueda";
                    }
                } 

            });
        }

    }
});