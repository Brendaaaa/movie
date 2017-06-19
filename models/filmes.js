var mongoose = require("mongoose");
mongoose.createConnection('mongodb://localhost:27017/gerenciadorDB');
var schema = mongoose.Schema;
var filmeSchema = {
	"id": Number,
	"titulo": String,
	"ano": String,
	"diretor": String,
	"sinopse": String,
	"poster": String,
	"generos": [String],
	"critica": String
};
module.exports = mongoose.model('filmes', filmeSchema); // associating schema to collection 'filmes'