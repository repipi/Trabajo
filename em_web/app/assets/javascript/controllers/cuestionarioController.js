angular.module('Emozio').controller('CuestionarioController', function(Paciente, Patologia, Psicologo, $scope, $routeParams, $location, $route){

    /* 1 - Guardamos la informacion del formulario en el paciente.
    2 - Buscamos la patologia que se corresponda con las respuestas del cuestionario y la guardamos tambien en el paciente.
    3 - Le asignamos a los psicologos que pueden tratar su patologia. 
    4 - Devolvemos su pagina de perfil con el array de psicologos */

    /*Recuperamos el objeto Paciente con el id que se encuentra en los parametros de ruta*/
    Paciente.GetById($routeParams.id).then(function(data){
        $scope.paciente=Object.values(data.data)[0];
        // console.log($scope.paciente);
    });

    Psicologo.GetAll().then(function(data){
        $scope.psicologos=Object.values(data.data);
        //        console.log($scope.psicologos);
    });

    Patologia.GetAll().then(function(data){
        $scope.patologias=Object.values(data.data);
        //        console.log($scope.patologias.length);
    });

    if($routeParams.n == 1){
        Patologia.GetPreguntas().then(function(data){
            var result = Object.values(data.data);
            var preguntas = [];

            for(var i=0, l=result.length; i<l; i++){
                //console.log(result[i].preguntas[0]);
                preguntas.push(JSON.parse('{ "pregunta" : "'+result[i].preguntas[0]+'", "respuesta" : '+0+'}'));
            }

            $scope.preguntas=preguntas;
            //            console.log($scope.preguntas);
        });

        $scope.submit="Siguiente";
    }

    if($routeParams.n == 2) {
        
        var preguntas=[];

        setTimeout(function(){
            for(var j=0, m=$scope.paciente.diagnostico.length; j<m; j++){
                for(var i=1, l=$scope.paciente.diagnostico[j].patologia.preguntas.length; i<l; i++){
                    preguntas.push(JSON.parse('{ "pregunta" : "'+$scope.paciente.diagnostico[j].patologia.preguntas[i]+'", "respuesta" : '+0+'}'));
                }
            }

            $scope.preguntas=preguntas;
            console.log($scope.preguntas);

        },500);

        //        var preguntas=[];
        //
        //        setTimeout(function(){
        //            //console.log("1");
        //            for(var i=0, l=$scope.patologias.length; i<l; i++){
        //                //console.log("2");
        //                for(var j=0, m=$scope.paciente.diagnostico.length; j<m; j++){
        //                    //console.log("3");
        //                    //console.log($scope.patologias[i].nombre+" "+$scope.paciente.diagnostico[j].patologia);
        //                    if($scope.patologias[i].nombre==$scope.paciente.diagnostico[j].patologia){
        //                        //console.log("4");
        //                        for(var k=1, n=$scope.patologias[i].preguntas.length; k<n; k++) {
        //                            preguntas.push(JSON.parse('{ "pregunta" : "'+$scope.patologias[i].preguntas[k]+'", "respuesta" : '+0+'}'));
        //                        }
        //                    }
        //                }
        //            }
        //            //console.log(preguntas);
        //            $scope.preguntas=preguntas;
        //            //console.log($scope.preguntas);
        //        },1000);
        //
        //        $scope.submit=="Enviar";
    }

    function buscarPatologia(paciente){      
        var patologiaCercana="";
        var maxActual=-1;

        /* Se recorren todas las patologias */
        for(var j=0, l=$scope.patologias.length; j<l; j++){
            var suma=0;

            /* Se suma el resultado de la multiplicacion de los elementos i de los arrays patologia y paciente.sintomas */
            for (var i=0, m=$scope.paciente.sintomas.length-1; i<m; i++){
                suma+=$scope.patologias[j].sintomas[i]*$scope.paciente.sintomas[i];
            }

            /* Si el maxActual es 0, la patologia no esta inicializada */
            if(maxActual<0){
                /* Guardamos la primera patologia */ 
                patologiaCercana=$scope.patologias[j].nombre;
                /* Guardamos el valor de la suma como maximo actual */
                maxActual=suma;
            }else if(maxActual<=suma){ /* Si la suma maxima es menor que la actual, se actualizan los valores */
                patologiaCercana="";
                patologiaCercana=$scope.patologias[j].nombre;
                maxActual=suma;
            }
        }

        /* Se guarda la patologia en el paciente */
        paciente.patologia=patologiaCercana;
    }

    /* Funcion que asigna los psicologos que pueden tratar la patologia del paciente */
    function asignarPsicologo(paciente){

        /* Se recorre el array de psicologos */
        for(var i=0, n=$scope.psicologos.length; i<n; i++){
            /* Si el array de patologias del psicologo contiene la patologia del paciente
            indexOf devuelve -1 si no lo enuentra */
            if($scope.psicologos[i].patologias.indexOf(paciente.patologia)!=-1){
                /* Se añade al array de psicologos de mi paciente */
                paciente.psicologos.push($scope.psicologos[i]);
            }
        }

        /* Actualizamos al paciente en la BBDD */
        Paciente.Update(paciente);

    }
    //
    //    /* Funcion que guarda las respuestas del cuestionario */
    //    $scope.check= function(data) { 
    //        
    //        /* Para cada una de las respuestas */
    //        for(var i in data){
    //            /* Si la respuesta i ha sido marcada como cierta, se almacena como afirmativa */
    //            if(data[i].SELECTED=="1"){
    //                $scope.preguntas[i].respuesta=1;
    //            } else { /* En caso contrario, como negativa */
    //                $scope.preguntas[i].respuesta=0; 
    //            }
    //
    //            /* Se guardan las respuestas del cuestionario en el array sintomas del paciente */ $scope.paciente.sintomas[i]=$scope.preguntas[i].respuesta;
    //        }
    //
    //        buscarPatologia($scope.paciente);
    //
    //        asignarPsicologo($scope.paciente);
    //
    //        $location.path("/usuarios/" + $scope.paciente._id);
    //
    //    }


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

        if($scope.submit=="Siguiente"){

            for(var i=0, l=$scope.patologias.length; i<l; i++){
                if($scope.preguntas[i].respuesta==1){
                    $scope.paciente.diagnostico.push(JSON.parse('{ "patologia" : '+JSON.stringify($scope.patologias[i]) +', "porcentaje" : '+0.25+'}'));
                } 
            }

            console.log($scope.paciente);
            Paciente.Update($scope.paciente);

            $location.path("/cuestionario/" + 2 + "/" + $routeParams.id);
            
             $route.reload();

        } else {

            //      setTimeout(function(){
            //                console.log("STA 2");
            //                for(var i=0, l=$scope.patologias.length; i<l; i++){
            //                    if($scope.preguntas[i].respuesta==1){
            //                        for(var j=0, m=$scope.paciente.diagnostico.length; j<m; j++) {
            //                            if($scope.patologias[i].nombre==$scope.paciente.diagnostico[j].patologia){
            //                                $scope.paciente.diagnostico[j].porcentaje+=$scope.patologias[i].respuesta;
            //                                if($scope.paciente.diagnostico[j].porcentaje < 0.5){
            //                                    /* Elimino en el array de diagnostico un elemento desde la posicion j */
            //                                    $scope.paciente.diagnostico.splice(j, 1);
            //                                }
            //                            }
            //                        }
            //                    } 
            //                }
            //            },2000);
            //
            //            //  console.log($scope.paciente);
            //
            //            asignarPsicologo($scope.paciente);

            //            $location.path("/usuarios/" + $scope.paciente._id);
        }

    }

});