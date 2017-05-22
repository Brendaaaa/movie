var mongoose = require("mongoose");
mongoose.createConnection('mongodb://localhost:27017/gerenciadorDB');
var schema = mongoose.Schema;
var usuarioSchema = {
	"id": Number,
	"username": String,
	"senha": String,
	"email": String,
	"image": String,
	"listaId": Number
};
module.exports = mongoose.model('usuarios', usuarioSchema);
