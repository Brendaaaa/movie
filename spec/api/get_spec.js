var frisby = require('frisby');
frisby.create('testa o metodo get')
  .get('http://localhost:3000/filmes')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
      filmes: Array
   })
.toss();



frisby.create('Caso dar nota: testa o metodo put de usuarios para adicionar nota')
  .put('http://localhost:3000/usuarios/977', {
	id: 977,
	username: "t",
	senha: "t",
	lista: [{"filmeId" :4, "titulo":"Logan", "nota":5, "poster":"lala"}]

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "SUCESSO"
  })
  .toss();

frisby.create('Caso dar nota: testa o metodo put de usuarios para adicionar nota caso o usuario nao exista (erro no formato da requisicao)')
  .put('http://localhost:3000/usuarios/97799', {
	id: 97799,
	username: "t",
	senha: "t",
	lista: [{"filmeId" :4, "titulo":"Logan", "nota":5, "poster":"lala"}]

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "O usuário que você tentou alterar não existe"
  })
  .toss();


frisby.create('Caso do ADC filme ADM. Testa o metodo de criacao de filme')
  .post('http://localhost:3000/filmes/', {
	id: 404,
	titulo: "t",
	ano: "2017",
	diretor: "Thales O",
	sinopse: "bla bla bla",
	poster: "some link",
	generos: ["Acao"],
	critica: "bla bla bla"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "Filme inserido no banco de dados"
  })
  .toss();

frisby.create('Caso do ADC Filme ADM. Testa o metodo de criacao de filme caso o filme ja exista no banco')
  .post('http://localhost:3000/filmes/', {
	id: 4,
	titulo: "t",
	ano: "2017",
	diretor: "Thales O",
	sinopse: "bla bla bla",
	poster: "some link",
	generos: ["Acao"],
	critica: "bla bla bla"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "Filme ja existente"
  })
  .toss();

frisby.create('Caso do ADC Filme ADM. Testa o metodo de criacao de filme caso tokens obrigatorios nao sejam passados')
  .post('http://localhost:3000/filmes/', {

	titulo: "t",
	ano: "2017",
	diretor: "Thales O",
	sinopse: "bla bla bla",
	poster: "some link",
	generos: ["Acao"],
	critica: "bla bla bla"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "Todos os campos sao obrigatorios. Não foi possível inserir o filme no banco de dados"
  })
  .toss();

frisby.create('Caso do Remove Filme ADM. Testa o metodo de remocao de filme')
  .delete('http://localhost:3000/filmes/404')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "Filme removido do banco de dados"
  })
  .toss();

frisby.create('Caso do Remove Filme ADM. Testa o metodo de remocao de filme caso remocao nao de certo')
  .delete('http://localhost:3000/filmes/40404')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "Filme inexistente"
  })
  .toss();


frisby.create('Teste ver detalhes filme: testa o metodo get com id filme')
  .get('http://localhost:3000/filmes/4')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
        filme : {
                 id: Number,
                 titulo: String,
                 ano: String,
		 diretor:String,
		 sinopse:String,
		 poster:String,
		 generos: Array,
		 critica:String
  }})
.toss();

frisby.create('Teste ver detalhes filme: testa o metodo get com id invalido')
  .get('http://localhost:3000/filmes/0')
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
      resultado: "Filme inexistente"
  })
.toss();


frisby.create('Caso cadastrar usuario. ')
  .post('http://localhost:3000/usuarios/', {

	id: 205,
	username: "oioioi",
 	senha: "thales",
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "Usuario inserido no banco de dados"
  })
  .toss();

frisby.create('Caso cadastrar usuario. Usuario ja existente ')
  .post('http://localhost:3000/usuarios/', {

	id: 203,
	username: "oioioi",
 	senha: "thales"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "usuario ja existente"
  })
  .toss();


frisby.create('Caso cadastrar usuario. Erro de token ')
  .post('http://localhost:3000/usuarios/', {

	
	username: "oioioi",
 	senha: "thales"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "Id, nome de usuário e senha são obrigatorios"
  })
  .toss();



frisby.create('Caso autenticacao ')
  .post('http://localhost:3000/authentication', {

	
	user: "t",
 	pass: "t"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
        user : {
                 id: Number,
                 username: String,
                 senha: String,
		 lista:Array
  }})
  .toss();


frisby.create('Caso autenticacao. Usuario e/ou senha invalidos')
  .post('http://localhost:3000/authentication', {

	
	user: "thal4334",
 	pass: "t4334434"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
        resultado: "Usuário inexistente ou senha inválida"})
  .toss();

frisby.create('Caso autenticacao. Usuario e/ou faltando')
  .post('http://localhost:3000/authentication', {

	
	user: "thal4334"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
        resultado: "Os campos não foram preenchidos corretamente"})
  .toss();


frisby.create('Caso remover nota: (Modifica campo lista) ')
  .put('http://localhost:3000/usuarios/977', {
	id: 977,
	username: "t",
	senha: "t",
	lista: []

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "SUCESSO"
  })
  .toss();



frisby.create('Caso remover nota: (Modifica campo lista) Erro no formato da requisicao')
  .put('http://localhost:3000/usuarios/97799', {
	id: 97799,
	username: "t",
	senha: "t",
	lista: []

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSON({
	resultado: "O usuário que você tentou alterar não existe"
  })
  .toss();

frisby.create('Caso buscar Filme por token.')
  .post('http://localhost:3000/filmes/', {

	
	busca: "Wonder Woman"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
        filmes : []
  })
  .toss();


frisby.create('Caso buscar Filme. Busca por token nao retorna results')
  .post('http://localhost:3000/filmes/', {

	
	busca: "Homem maravilha"
	

  }, {json: true})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'application/json')
  .expectJSONTypes({
        resultado: "Sua busca não retornou resultados"})
  .toss();

