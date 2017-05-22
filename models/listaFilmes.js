var mongoose = require("mongoose");
mongoose.createConnection('mongodb://localhost:27017/gerenciadorDB');
var schema = mongoose.Schema;
var listaFilmeSchema = {
	"id": Number,
	"filmesId": [Number]
};
module.exports = mongoose.model('listaFilmes', listaFilmeSchema);
