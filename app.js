// Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var mongoOp = require('./models/mongo');

// adicione "ponteiro" para filme
var filmeOp = require('./models/filmes');

var usuarioOp = require('./models/usuarios');

// comente as duas linhas abaixo
// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// serve static files
app.use('/', express.static(__dirname + '/'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adicione as duas linhas abaixo
var router = express.Router();
app.use('/', router);   // deve vir depois de app.use(bodyParser...

// comente as duas linhas abaixo
// app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status ||
  
   500);
  res.render('error');
});

module.exports = app;

// codigo abaixo adicionado para o processamento das requisições
// HTTP GET, POST, PUT, DELETE

function checkAuth(req, res) {
  cookies = req.cookies;
  var key = '';
  if(cookies) key = cookies.EA975;
  if(key == 'secret') return true;
  res.json({'resultado': 'Clique em LOGIN para continuar'});
  return false;
}

// index.html
router.route('/') 
.get(function(req, res) {  // GET
    var path = 'index.html';
    res.sendfile(path, {"root": "./"});
});
  
router.route('/') 
.get(function(req, res) {  // GET
    var path = 'usuarios.html';
    res.sendfile(path, {"root": "./"});
});

router.route('/alunos')   // operacoes sobre todos os alunos
  .get(function(req, res) {  // GET
  if(! checkAuth(req, res)) return;
    var response = {};
    mongoOp.find({}, function(erro, data) {
       if(erro)
          response = {"resultado": "Falha de acesso ao banco de dados"};
        else
          response = {"alunos": data};
          res.json(response);
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
     var query = {"ra": req.body.ra};
     var response = {};
     mongoOp.findOne(query, function(erro, data) {
        if (data == null) {
           var db = new mongoOp();
           db.ra = req.body.ra;
           db.nome = req.body.nome;
           db.curso = req.body.curso;
           db.save(function(erro) {
             if(erro) {
                 response = {"resultado": "Falha de insercao no BD"};
                 res.json(response);
             } else {
                 response = {"resultado": "Aluno inserido no BD"};
                 res.json(response);
              }
            }
          )
        } else {
        response = {"resultado": "Aluno ja existente"};
            res.json(response);
          }
        }
      )
    }
  );


router.route('/alunos/:ra')   // operacoes sobre um aluno (RA)
  .get(function(req, res) {   // GET
  if(! checkAuth(req, res)) return;
      var response = {};
      var query = {"ra": req.params.ra};
      mongoOp.findOne(query, function(erro, data) {
         if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
         } else if (data == null) {
             response = {"resultado": "aluno inexistente"};
             res.json(response);   
     } else {
        response = {"alunos": [data]};
            res.json(response);
           }
        }
      )
    }
  )
  .put(function(req, res) {   // PUT (altera)
  if(! checkAuth(req, res)) return;
      var response = {};
      var query = {"ra": req.params.ra};
      var data = {"nome": req.body.nome, "curso": req.body.curso};
      mongoOp.findOneAndUpdate(query, data, function(erro, data) {
          if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
      } else if (data == null) { 
             response = {"resultado": "aluno inexistente"};
             res.json(response);   
          } else {
             response = {"resultado": "aluno atualizado no BD"};
             res.json(response);   
      }
        }
      )
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
  if(! checkAuth(req, res)) return;
        var response = {};
        var query = {"ra": req.params.ra};
        mongoOp.findOneAndRemove(query, function(erro, data) {
            if(erro) {
                response = {"resultado": "Falha de acesso ao banco de dados"};
                res.json(response);
            } else if (data == null) {        
                response = {"resultado": "aluno inexistente"};
                res.json(response);
            } else {
                response = {"resultado": "aluno removido do BD"};
                res.json(response);
            }
        })
   });

router.route('/filmes')   // operacoes sobre todos os filmes
.get(function(req, res) {  // GET

    var response = {};
    filmeOp.find({}, function(erro, data) {
        if(erro){
            response = {"resultado": "Falha de acesso ao banco de dados"};
        } else {
            response = {"filmes": data}; //TODO ter generos na forma d string....
        }
        res.json(response);
    })
})
.post(function(req, res) {   // POST (cria e busca filmes)

    if (req.body.busca != null){ //eh um caso de busca
        var query = {"titulo": req.body.busca};
        var response = {};
        filmeOp.find(query, function(erro, data) {
            if (data != null && data.length > 0) {
                response = {"filmes": data};
            } else {
                response = {"resultado": "Sua busca não retornou resultados"};
            }
            res.json(response);
        })
    } else if (req.body.filtro != null){ //eh um caso de filtro
        var query = {"generos": req.body.filtro};
        var response = {};
        filmeOp.find(query, function(erro, data) {
            if (data != null && data.length > 0) {
                response = {"filmes": data};
            } else {
                response = {"resultado": "Sua busca não retornou resultados"};
            }
            res.json(response);
        })
    } else if (req.body.lancamento != null){ //eh um caso de filtro
        var query = {"ano": req.body.lancamento};
        var response = {};
        filmeOp.find(query, function(erro, data) {
            if (data != null && data.length > 0) {
                response = {"filmes": data};
            } else {
                response = {"resultado": "Sua busca não retornou resultados"};
            }
            res.json(response);
        })
    } else {
        var query = {"id": req.body.id};
        var response = {};
        filmeOp.findOne(query, function(erro, data) {
            if (data == null) {
                var db = new filmeOp();
                //TODO Adicionar todos os campos
                try {   
                    if(req.body.id == null || req.body.titulo == null || req.body.ano == null || req.body.diretor == null || req.body.sinopse == null || req.body.poster == null || req.body.generos == null || req.body.critica == null){ //TODO remove id como obrigatorio, pq o id eh gerado pelo servidor
                        //TODO tratar quando o id ja foi usado
                        throw error;
                    }
                    db.id = req.body.id;
                    db.titulo = req.body.titulo;
                    db.ano = req.body.ano;
                    db.diretor = req.body.diretor;
                    db.sinopse = req.body.sinopse;
                    db.poster = req.body.poster;
                    db.generos = req.body.generos;
                    db.critica = req.body.critica;      
                } catch(error) {
                    response = {"resultado": "Id e titulo sao obrigatorios. Não foi possível inserir o filme no banco de dados"};
                    return res.json(response);
                }
            
                db.save(function(erro) {
                    if(erro) {
                        response = {"resultado": "Um problema ocorreu ao inserir o filme no banco de dados, tente novamente mais tarde."};
                        res.json(response);
                    } else {
                        response = {"resultado": "Filme inserido no banco de dados"};
                        res.json(response);
                    }
                })

            } else {
                response = {"resultado": "Filme ja existente"};
                res.json(response);
            }
        })
    }
})//;
.delete(function(req, res) {
    
//    TODO eh necessario um mecanismo de deletar todos os filmes?
//    console.log(req.path); 
//    console.log(JSON.stringify(req.body));
//    res.status(200).send('String test');
});


router.route('/filmes/:id')   // operacoes sobre um filme(id)
.get(function(req, res) {   // GET
    var response = {};
    var query = {"id": req.params.id};
    filmeOp.findOne(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {
            response = {"resultado": "Filme inexistente"};
            res.json(response);   
        } else {
            response = {"filme": data};
            res.json(response);
        }
    })
})
.put(function(req, res) {   // PUT (altera)
    var response = {};
    var query = {"id": req.params.id};
    var data = req.body;
    filmeOp.findOneAndUpdate(query, data, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) { 
            response = {"resultado": "Filme inexistente"};
            res.json(response);   
        } else {
            response = {"resultado": "Filme atualizado no banco de dados"};
            res.json(response);   
        }
    })
})
.delete(function(req, res) {   // DELETE (remove)
    var response = {};
    var query = {"id": req.params.id};
    filmeOp.findOneAndRemove(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {        
            response = {"resultado": "Filme inexistente"};
            res.json(response);
        } else {
            response = {"resultado": "Filme removido do banco de dados"};
            res.json(response);
        }
    })
});
   
router.route('/usuarios') 
.get(function(req, res) {  // GET

    var response = {};
    usuarioOp.find({}, function(erro, data) {
        if(erro){
          response = {"resultado": "Falha de acesso ao banco de dados"};
        } else {
            response = {"usuarios": data};
            res.json(response);
        }
    })
})
.post(function(req, res) { // POST (cria)

    var query = {"id": req.body.id};
    var response = {};
    usuarioOp.findOne(query, function(erro, data) {
        if (data == null) {
            var db = new usuarioOp(); //TODO checar se algum campo obrigatorio esta vazio... || funciona o que eu fiz, agora se alguém quiser modificar a implementação, a vontade
            try {
                if(req.body.id == null ){//|| req.body.username == null || req.body.senha == null || req.body.email == null){
                    throw error;
                }
                db.id = req.body.id;
                db.username = req.body.username;
                db.senha = req.body.senha;
                db.email = req.body.email;
                db.lista = req.body.lista;
                
                db.save(function(erro) {
                    if(erro) {
                        response = {"resultado": "Um problema ocorreu ao inserir o usuario no banco de dados, tente novamente mais tarde."};
                        res.json(response);
                    } else {
                        response = {"resultado": "Usuario inserido no banco de dados"};
                        res.json(response);
                    }
                })
            
            } catch(error) {
                response = {"resultado": "Falha 1 de insercao no BD"};
                return res.json(response);
            }
        } else {
            response = {"resultado": "usuario ja existente"};
            res.json(response);
        }
    })
})
.delete(function(req, res) {  
    console.log(req.path); 
    console.log(JSON.stringify(req.body));
    res.status(200).send('String test');
});

router.route('/usuarios/:id')   // operacoes sobre um usuario(id)
.get(function(req, res) {   // GET
    var response = {};
    var query = {"id": req.params.id};
    usuarioOp.findOne(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {
            response = {"resultado": "usuario inexistente"};
            res.json(response);   
        } else {
            response = {"usuario": data};
            res.json(response);
        }
        console.log(response);
    })
})
.put(function(req, res) {   // PUT (altera)
    var response = {};
    var query = {"id": req.params.id};
    usuarioOp.findOneAndUpdate(query, req.body.usuario, { new: true }, function(erro, data) {
        if(erro != null) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) { 
            response = {"resultado": "O usuário que você tentou alterar, não existe"};
            res.json(response);   
        } else {
            response = {"resultado": "SUCESSO",
                        "usuario" : data}; // cada pagina html coloca uma mensagem de sucesso apropriada "Nota atualizada", "Perfil atualizado"... dado que este método é utilizado por varios
            res.json(response);   
        }
    })
})
.delete(function(req, res) {   // DELETE (remove)
    var response = {};
    var query = {"id": req.params.id};
    usuarioOp.findOneAndRemove(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {        
            response = {"resultado": "usuario inexistente"};
            res.json(response);
        } else {
            //deletar lista e notas deste usuario aqui
            response = {"resultado": "usuario removido do BD"};
            res.json(response);
        }
    })
});

router.route('/authentication')   // autenticação
  .get(function(req, res) {  // GET
     var path = 'auth.html';
     res.header('Cache-Control', 'no-cache');
     res.sendfile(path, {"root": "./"});
     }
  )
  .post(function(req, res) { 
     console.log(JSON.stringify(req.body));
     var user = req.body.user;
     var pass = req.body.pass;
     // verifica usuario e senha na base de dados
     
     
     var response = {};
     var query = {"username": user, "senha": pass};
     usuarioOp.findOne(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {
            response = {"resultado": "usuario inexistente ou senha invalida"};
    		res.status(401).send('eq.body.pass');   // unauthorized
        } else {
            response = {"usuarios": [data]};
			if(user == data.username && pass == data.senha) {
	  			res.cookie('EA975', 'secret', {'maxAge': 3600000*24*5});
	  			res.status(200).send('/usuario.html"');  // OKss
      		} else {
	  			res.status(401).send('eq.body.pass');   // unauthorized
      		}
        }
       })
     }
  )
  .delete(function(req, res) {
     res.clearCookie('EA975');	 // remove cookie no cliente
     res.json({'resultado': 'Sucesso'});
     }
);