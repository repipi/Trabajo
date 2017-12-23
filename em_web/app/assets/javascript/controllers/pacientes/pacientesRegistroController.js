angular.module('Emozio').controller('PacientesRegistroController', function(Paciente, $scope, $location){

    /* Google Place API Web Service */
    var autocomplete;   
    var place;

    $scope.initAutocomplete = function() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            { types: ['(cities)'],
             componentRestrictions: {country: "es"}});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);

        function fillInAddress() {
            // Get the place details from the autocomplete object.
            place = autocomplete.getPlace();
        }
    }

    $scope.geolocate = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                //autocomplete.setBounds(circle.getBounds());
            });
        }
    }

    $("#autocomplete").focus(function() {
        $scope.geolocate();
    });

    /* Funcion check que valida el cuestionario de registro */
    $scope.check = function(paciente) { 
        /* Indicamos que se esta tratando de enviar */
        $scope.isSubmitting = true;
        
        var nuevoPaciente = {
            email: paciente.email,
            password: paciente.password,
            localizacion: place.name,
            telefono: paciente.telefono            
        };
        
        console.log(nuevoPaciente);
        
        //        
        //        if($scope.formulario_registro.$valid){
        //            /* Se guarda el objeto paciente del formulario. Despues, */
        //            Paciente.SignUp(paciente).then(function(){
        //                /* Se redirecciona al perfil del paciente */
        //                $location.path("/usuarios");
        //            }); 
        //
        //        }
    }
});