angular.module('Emozio').controller('CuestionarioController', function(Paciente, Patologia, Psicologo, $scope, $routeParams, $location, $route){

    /* 1 - Guardamos la informacion del formulario en el paciente.
    2 - Buscamos la patologia que se corresponda con las respuestas del cuestionario y la guardamos tambien en el paciente.
    3 - Le asignamos a los psicologos que pueden tratar su patologia. 
    4 - Devolvemos su pagina de perfil con el array de psicologos */

    /*Recuperamos el objeto Paciente con el id que se encuentra en los parametros de ruta*/
    Paciente.GetById().then(function(data){
        $scope.paciente=Object.values(data.data)[0];
        //console.log($scope.paciente);
    });

    Psicologo.GetAll().then(function(data){
        $scope.psicologos=Object.values(data.data);
        //        console.log($scope.psicologos);
    });

    Patologia.GetAll().then(function(data){
        $scope.patologias=Object.values(data.data);
        //        console.log($scope.patologias.length);
    });

    Paciente.GetDiagnostico().then(function(data){
        $scope.diagnostico=Object.values(data.data)[0].diagnostico;

        /* Si no existe diagnostico */
        if(!$scope.diagnostico.length || $scope.paciente.psicologos.length){

            /* Se recogen las preguntas de todas las patologia */
            Patologia.GetPreguntas().then(function(data){

                var result = Object.values(data.data);
                var preguntas = [];

                /* Se recoge la primera pregunta de cada patologia */
                for(var i=0, l=result.length; i<l; i++){
                    preguntas.push(JSON.parse('{ "pregunta" : "'+result[i].preguntas[0]+'", "respuesta" : '+0+'}'));
                }

                /* Se establece el array de preguntas */
                $scope.preguntas=preguntas;
            });

            /* Se establece el boton con el nombre de submit */
            $scope.submit="Siguiente";
            
            $scope.progress_bar = 0;

        }else{

            var preguntas=[];

            /* Se recogen los diagnosticos correspondientes a cada patologia */
            for(var j=0, m=$scope.diagnostico.length; j<m; j++){
                /* Se recogen las preguntas existentes en la patologia de cada diagnostico */
                for(var i=0, l=$scope.diagnostico[j].patologia.preguntas.length; i<l; i++){
                    preguntas.push(JSON.parse('{ "pregunta" : "'+$scope.diagnostico[j].patologia.preguntas[i]+'", "respuesta" : '+0+'}'));
                }
            }

            /* Se establece el array de preguntas */
            $scope.preguntas=preguntas;

            /* Se establece el boton con el nombre de submit */
            $scope.submit="Enviar";
            
            $scope.progress_bar = 70;
        }
    });
    
    /* Establezco el estilo de los botones si o no, por defecto */
    $scope.press_yes="";
    $scope.press_no="teal";

    /* Funcion que asigna los psicologos que pueden tratar la patologia del paciente */
    function asignarPsicologo(paciente){

        /* Se recorre el array de psicologos */
        for(var i=0, n=$scope.psicologos.length; i<n; i++){
            /* Se recorren los diagnosticos del paciente */
            for(var j=0, m=paciente.diagnostico.length; j<m; j++){
                /* Si el array de patologias del psicologo contiene la patologia de ese diagnostico del paciente
            indexOf devuelve -1 si no lo enuentra */
                if($scope.psicologos[i].patologias.indexOf(paciente.diagnostico[j].patologia.nombre)!=-1){
                    /* Se añade al array de psicologos de mi paciente */
                    paciente.psicologos.push($scope.psicologos[i]);
                }
            }
        }

        /* Actualizamos al paciente en la BBDD */
        Paciente.Update(paciente);
        //console.log(paciente);

    }

    /* Funcion que guarda las respuestas del cuestionario */
    $scope.check= function(data) { 

        /* Para cada una de las respuestas */
        for(var i in data){
            /* Si la respuesta i ha sido marcada como cierta, se almacena como afirmativa */
            if(data[i].SELECTED=="1"){
                $scope.preguntas[i].respuesta=1;
            } else { /* En caso contrario, como negativa */
                $scope.preguntas[i].respuesta=0; 
            }
        }

        /* Se quitan los psicologos y diagnostico existentes */
        $scope.paciente.psicologos=[];
        Paciente.Update($scope.paciente);
        
        //        for(var i=0, l=$scope.preguntas.length; i<l; i++){
        //            console.log(i+" "+$scope.preguntas[i].respuesta);   
        //        }

        /* Si el paciente no tiene diagnostico */
        if(!$scope.diagnostico.length){

            /* Recorro el numero de patologias: Cada patologia tiene una sola pregunta */
            for(var i=0, l=$scope.patologias.length; i<l; i++){
                /* Si la pregunta esta marcada */
                if($scope.preguntas[i].respuesta==1){
                    /* Introduzco la posible patologia entre los diagnosticos del paciente */
                    $scope.paciente.diagnostico.push(JSON.parse('{ "patologia" : '+JSON.stringify($scope.patologias[i]) +', "porcentaje" : '+0.50+'}'));
                    //JSON.stringify($scope.patologias[i].respuesta)
                } 
            }

            /* Para cada diagnostico del paciente */
            for(var j=0, l=$scope.paciente.diagnostico.length; j<l; j++){
                /* Se elimina la primera pregunta de las preguntas de la patologia del diagnostico */
                $scope.paciente.diagnostico[j].patologia.preguntas.splice(0, 1);
            }

            /* Se actualiza la informacion del paciente */
            Paciente.Update($scope.paciente);
            //console.log($scope.paciente);

            /* Se carga la segunda parte del cuestionario */
            $location.path("/cuestionario/" + 2);

        }else{

            /* Se recorren los diagnosticos del paciente */
            for(var i=0, l=$scope.diagnostico.length; i<l; i++){
                /* Se recorren todas las preguntas (ahora falta la primera) de la patologia de cada diagnostico */
                for(var j=0, m=$scope.diagnostico[i].patologia.preguntas.length; j<m; j++){
                    /* Si la pregunta esta marcada */
                    if($scope.preguntas[j].respuesta==1){
                        /* Se sumara al porcentaje de ese diagnostico el valor de la respuesta de esa patologia */
                        $scope.paciente.diagnostico[i].porcentaje=$scope.paciente.diagnostico[i].porcentaje+$scope.diagnostico[i].patologia.respuesta;
                    }
                }
                /* Si el porcentaje de ese diagnostico del paciente es menor que el 70% */
                if($scope.paciente.diagnostico[i].porcentaje < 0.7){
                    /* Elimino en el array de diagnosticos ese diagnostico */
                    $scope.paciente.diagnostico.splice(i, 1);
                }
            }

            /* Se actualiza la informacion del paciente */
            Paciente.Update($scope.paciente);
            // console.log($scope.paciente);


            /* Se asigna al psicologo que puede tratar ese diagnostico */
            asignarPsicologo($scope.paciente);

            $location.path("/usuarios");

        }
    }

});