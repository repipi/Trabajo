var app = require("./server/routes");

// Se inicia el servidor
var server = app.listen(8000, function() {
 console.log('Listening on port %d', server.address().port);
});
