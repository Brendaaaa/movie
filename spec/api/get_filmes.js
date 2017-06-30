var frisby = require('frisby');
frisby.create('testa o metodo get')
  .get('http://localhost:3000/filmes')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      filmes: Array
   })
.toss();

frisby.create('testa o metodo get com id filme')
  .get('http://localhost:3000/filmes/4')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
        filmes : [{
                 id: Number,
                 titulo: String,
                 ano: String,
		 diretor:String,
		 sinopse:String,
		 poster:String,
		 generos:String,
		 critica:String
  }]})
.toss();

frisby.create('testa o metodo get com id invalido')
  .get('http://localhost:3000/alunos/0')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
      resultado: "Filme inexistente"
  })
.toss();


