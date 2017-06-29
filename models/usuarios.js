var mongoose = require("mongoose");
mongoose.createConnection('mongodb://localhost:27017/gerenciadorDB');
var schema = mongoose.Schema;
var usuarioSchema = {
	"id": Number,
	"username": String,
	"senha": String,
	"lista": [{"filmeId" : Number, "titulo": String, "nota": Number, "poster": String}]
};
module.exports = mongoose.model('usuarios', usuarioSchema);
