var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Paciente = require('../models/paciente');

/* A serializeUser se le pasa una funcion anonima con usuario y done */
/* Metodo que devuelve el _id de un paciente */
passport.serializeUser(function(usuarios, done){
    /* null porque no ha ocurrido ningun error 
    Passport utiliza el _id para hacer el match entre la sesion y el objeto paciente */
    console.log("serializing " + usuarios.username);
    done(null, usuarios._id);
})

/* Metodo que devuelve el paciente al que corresponde un _id */
passport.deserializeUser(function(id, done){
    Paciente.findById(id, function(error, usuario){
        console.log("deserializing " + id);
        done(null, usuario);
    })
})

/* Passport utiliza la estrategia local */
passport.use(new LocalStrategy(    
    /* Comprueba que el email se corresponde con la contraseña que estamos obteniendo */
    /* Como se llama el campo del nombre de usuario. En este caso, el email 
    Es lo que devuelve el req.body */
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (username, password, done) {   
        Paciente.findOne({email: username}, function(error, paciente){
            /* En el caso de que no exista el email indicado */
            if(!paciente){
                /* null: No hay error;
                false: No tiene resultado */
                return done(null, false, {message: 'Este email: '+email+'no esta registrado'});
            } else {
                paciente.compararPassword(password, function(error, sonIguales){
                    /* Si existe un usuario con ese correo, y las contraseñas son iguales */
                    if(sonIguales){
                        return done(null, paciente);
                    } else {
                        return done(null, false, {message: 'La contraseña no es valida'});
                    }
                });
            }
        });
    }
));

exports.estaAutenticado = function (req, res, next){
    if(req.isAuthenticated()){
        console.log("Esta autenticado");
        return next();
    }
    /* EL usuario no esta autorizado para acceder a este recurso */
    //    res.status(401).send('Tienes que hacer login para acceder a este recurso');
    req.session.error = 'Please sign in!';
    res.redirect('/');
}