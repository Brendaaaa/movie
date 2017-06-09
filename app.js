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

var notaOp = require('./models/notas');

var usuarioOp = require('./models/usuarios');

var listaOp = require('./models/listaFilmes');

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// codigo abaixo adicionado para o processamento das requisições
// HTTP GET, POST, PUT, DELETE

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
            response = {"filmes": data};
        }
        res.json(response);
    })
})
.post(function(req, res) {   // POST (cria)

    var query = {"id": req.body.id};
    var response = {};
    filmeOp.findOne(query, function(erro, data) {
        if (data == null) {
            var db = new filmeOp(); //TODO checar se algum campo obrigatorio esta vazio... || funciona o que eu fiz, agora se alguém quiser modificar a implementação, a vontade
            //TODO Adicionar todos os campos
            try {   
                if(req.body.id == null || req.body.titulo == null){ //TODO remove id como obrigatorio, pq o id eh gerado pelo servidor
                    //TODO tratar quando o id ja foi usado
                    throw error;
                }
                db.id = req.body.id;
                db.titulo = req.body.titulo;
                db.elenco = req.body.elenco;
                db.diretor = req.body.diretor;
                db.dataLanc = req.body.dataLanc;
                db.rank = req.body.rank;
                db.generos = req.body.generos;
                db.trailer = req.body.trailer;      
            } catch(error){
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
            response = {"filme": [data]};
            res.json(response);
        }
    })
})
.put(function(req, res) {   // PUT (altera)
    var response = {};
    var query = {"id": req.params.id};
    var data = {"titulo" : req.body.titulo, "elenco" : req.body.elenco, "diretor" : req.body.diretor, "dataLanc" : req.body.dataLanc, "rank" : req.body.rank, "generos" : req.body.generos, "trailer" : req.body.trailer};
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


router.route('/notas')   // operacoes sobre todas as notas
.get(function(req, res) {  // GET

    var response = {};
    notaOp.find({}, function(erro, data) {    
        if(erro) {
            response = {"resultado": "/notas: Falha de acesso ao banco de dados"};
        } else {
            response = {"notas": data};
            res.json(response);
        }
    })
})
.post(function(req, res) {   // POST (cria)
    
    var query = {"id": req.body.id};
    var response = {};
    notaOp.findOne(query, function(erro, data) {
        
        if (data == null) {
        
            var db = new notaOp(); //TODO checar se algum campo obrigatorio esta vazio...|| funciona o que eu fiz, agora se alguém quiser modificar a implementação, a vontade
            try {
                if(req.body.id == null || req.body.valor == null || req.body.filmeId == null || req.body.usuarioId == null) {
                    throw error;
                }
                db.id = req.body.id;
                db.valor = req.body.valor;
                db.filmeId = req.body.filmeId;
                db.usuarioId = req.body.usuarioId;
            } catch(error) {
                response = {"resultado": "Falha 1 de insercao no BD"};
                return res.json(response);
            }

            db.save(function(erro) {
                if(erro) {
                    response = {"resultado": "notas: Falha 2 de insercao no BD"};
                    res.json(response);
                } else {
                    response = {"resultado": "Nota inserida no BD"};
                    res.json(response);
                }
            })

        } else {
            response = {"resultado": "Nota ja existente"};
            res.json(response);
        }

    })
})
.delete(function(req, res) {  
    console.log(req.path); 
    console.log(JSON.stringify(req.body));
    res.status(200).send('String test');
});


router.route('/notas/:id')   // operacoes sobre uma nota(id)
.get(function(req, res) {   // GET
    var response = {};
    var query = {"id": req.params.id};
    notaOp.findOne(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {
            response = {"resultado": "nota inexistente"};
            res.json(response);   
        } else {
            response = {"notas": [data]};
            res.json(response);
        }
    })
})
.put(function(req, res) {   // PUT (altera)
    var response = {};
    var query = {"id": req.params.id};
    var data = {"valor" : req.body.valor, "filmeId" : req.body.filmeId, "usuarioId" : req.body.usuarioId};
    notaOp.findOneAndUpdate(query, data, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) { 
            response = {"resultado": "nota inexistente"};
            res.json(response);   
        } else {
            response = {"resultado": "nota atualizado no BD"};
            res.json(response);   
        }
    })
})
.delete(function(req, res) {   // DELETE (remove)
    var response = {};
    var query = {"id": req.params.id};
    notaOp.findOneAndRemove(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {        
            response = {"resultado": "nota inexistente"};
            res.json(response);
        } else {
            response = {"resultado": "nota removido do BD"};
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
.post(function(req, res) {   // POST (cria)

    var query = {"id": req.body.id};
    var response = {};
    usuarioOp.findOne(query, function(erro, data) {
        if (data == null) {
            var db = new usuarioOp(); //TODO checar se algum campo obrigatorio esta vazio... || funciona o que eu fiz, agora se alguém quiser modificar a implementação, a vontade
            try {
                if(req.body.id == null || req.body.username == null || req.body.senha == null || req.body.email == null){
                    throw error;
                }
                db.id = req.body.id;
                db.username = req.body.username;
                db.senha = req.body.senha;
                db.email = req.body.email;
                db.listaId = req.body.id*10;
            } catch(error) {
                response = {"resultado": "Falha 1 de insercao no BD"};
                return res.json(response);
            }

            //TODO criar lista = e pegar seu respectivo ID || funciona o que eu fiz, agora se alguém quiser modificar a implementação, a vontade
            var db2 = new listaOp();
            db2.id = req.body.id*10;
            db2.filmesId = null; //array de id, mas inicializa com lista vazia
            db2.save(function(erro) {
                if(erro) {
                    response = {"resultado": "Falha 2 de insercao no BD"};
                    res.json(response);
                } else {
                    //so tenta salvar o usuario se conseguiu criar a lista...
                    db.save(function(erro) {
                        if(erro) {
                            response = {"resultado": "Falha 3 de insercao no BD"};
                            res.json(response);
                        } else {
                            response = {"resultado": "usuario inserido no BD"};
                            res.json(response);
                        }
                    })
                }
            })           
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
            response = {"usuarios": [data]};
            res.json(response);
        }
    })
})
.put(function(req, res) {   // PUT (altera)
    var response = {};
    var query = {"id": req.params.id};
    var data = {"username" : req.body.username, "senha" : req.body.senha, "email" : req.body.email};
    usuarioOp.findOneAndUpdate(query, data, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) { 
            response = {"resultado": "usuario inexistente"};
            res.json(response);   
        } else {
            response = {"resultado": "usuario atualizado no BD"};
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
   

router.route('/listas')   // operacoes sobre todas as listas
.get(function(req, res) {  // GET
    var response = {};
    listaOp.find({}, function(erro, data) {
        if(erro){
            response = {"resultado": "Falha de acesso ao banco de dados"};
        } else {
            response = {"listas": data}; //TODO message?
            res.json(response);
        }
    })
})
.post(function(req, res) {   // POST (cria)
    var query = {"id": req.body.id};
    var response = {};
    listaOp.findOne(query, function(erro, data) {
        if (data == null) {
            var db = new listaOp();
            db.id = req.body.id;
            db.filmesId = req.body.filmesId; //array de id, mas inicializa com lista vazia
            db.save(function(erro) {
                if(erro) {
                    response = {"resultado": "Falha de insercao no BD"};
                    res.json(response);
                } else {
                    response = {"resultado": "Lista inserido no BD"};
                    res.json(response);
                }
            })
        } else {
            response = {"resultado": "Lista ja existente"};
            res.json(response);
        }
     })
  });
  //OBs: nao tem pq deletar todas as listas, uma vez q ao deletar um usuario deleta sua lista por id

router.route('/listas/:id')   // operacoes sobre uma lista(id)
.get(function(req, res) {   // GET
    var response = {};
    var query = {"id": req.params.id}; //é uma array nao sei se muda algo
    listaOp.findOne(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {
            response = {"resultado": "Lista inexistente"};
            res.json(response);
        } else {
            response = {"listas": [data]};
            res.json(response);
        }
    })
})
.put(function(req, res) {   // PUT (altera)
    var response = {};
    var query = {"id": req.params.id};
    var data = {"filmesId" : req.body.filmesId};
    listaOp.findOneAndUpdate(query, data, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) { 
            response = {"resultado": "Lista inexistente"};
            res.json(response);   
        } else {
            response = {"resultado": "Lista atualizada"}; //TODO maybe we should return the updated version?
            res.json(response);   
        }
    })
})
.delete(function(req, res) {   // DELETE (remove)
    var response = {};
    var query = {"id": req.params.id};
    listaOp.findOneAndRemove(query, function(erro, data) {
        if(erro) {
            response = {"resultado": "Falha de acesso ao banco de dados"};
            res.json(response);
        } else if (data == null) {        
            response = {"resultado": "Lista inexistente"};
            res.json(response);
        } else {
            //TODOdeletar lista e notas deste usuario aqui
            response = {"resultado": "Lista removida"};
            res.json(response);
        }
    })
});
