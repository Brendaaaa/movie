var mongoose = require("mongoose");
mongoose.createConnection('mongodb://localhost:27017/gerenciadorDB');
var schema = mongoose.Schema;
var notaSchema = {
	"id": Number,
	"valor": Number,
	"filmeId": Number,
	"usuarioId": Number
};
module.exports = mongoose.model('notas', notaSchema);
