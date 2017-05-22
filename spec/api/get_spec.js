var frisby = require('frisby');
frisby.create('testa o metodo get')
  .get('http://localhost:3000/alunos')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      alunos: Array
   })
.toss();

frisby.create('testa o metodo get com RA')
  .get('http://localhost:3000/alunos/123456')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
        alunos : [{
                 ra: String,
                 nome: String,
                 curso: String
  }]})
.toss();

frisby.create('testa o metodo get com RA invalido')
  .get('http://localhost:3000/alunos/0')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
      resultado: "aluno inexistente"
  })
.toss();
