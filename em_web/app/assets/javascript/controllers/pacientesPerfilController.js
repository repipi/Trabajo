angular.module('Emozio').controller('PacientesPerfilController', function(Paciente, Psicologo, $scope, $routeParams, $location){

    /* Obtenemos el paciente que ha iniciado la sesion */
    Paciente.GetById($routeParams.id).then(function(data){
        $scope.paciente=Object.values(data.data)[0];
        $scope.psicologos=$scope.paciente.psicologos;
        //console.log($scope.paciente);
    });


    /* Funcion del boton "Hacer el test" */
    $scope.hacer=function(){
        /* Redireccionado al cuestionario */
        $location.path("cuestionario/" + 1 + "/" + $scope.paciente._id);   
    }

    /* Funcion del boton "Filtrar" */
    $scope.filtrar = function(psicologo) { 

        console.log($scope.paciente);
        
        //console.log(psicologo);

        Psicologo.Filtrar(psicologo).then(function(data){
            var psicologosFiltrados=Object.values(data.data);

            if(psicologosFiltrados.length){
                for(var i=0, l=psicologosFiltrados.length; i<l; i++){
                    if($scope.psicologos.indexOf(psicologosFiltrados[i])==-1){
                        psicologosFiltrados.splice(i, 1);
                    }
                }
                $scope.mensaje="";
            } 
            
            if(!psicologosFiltrados.length){
                $scope.mensaje="No existen resultados para su busqueda";
            }

            $scope.psicologos=psicologosFiltrados;

        });

    }
});