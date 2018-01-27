/* Nos permite no tener que pasar los objetos a JSON para poderlos manipular */
var bodyParser = require('body-parser');

module.exports = function(app, express) {
    // Proporciona static assets de la carpeta "app", lo que nos permite tener la parte cliente separada del servidor.
    app.use("/", express.static("app/"));

    // Se establece el directorio view, lo que permite usar el .render method dentro de las routes
    app.set('views', __dirname + '/../app/views');

    /* Codifica los campos de un formulario con metodo post */
    app.use(bodyParser.urlencoded({ extended: true }));
    
    // Parse application/json
    app.use(bodyParser.json());
}
