var express = require('express');
var router = express.Router();

/* A rota GET acessa a página newMachine quando acessamos /newMachine no navegador */
router.get('/newMachine', function(req, res, next) {
  res.render('newMachine', { title: 'Novo Cadastro de Máquina', doc: {"nome":"","events_id":""}, action: '/newMachine' });
});

/* Essa rota quando acessada via POST, chama o objeto global db para salvar os dados no Mongo. 
A rota será a mesma /newMachine, porém com o verbo POST. Pego os dados que foram postados no body
da requisição HTTP usando o objeto req (request/requisição) depois crio um JSON 
com essas duas variáveis e envio para função insert. Na função de callback exigida pelo insert 
existe uma validação que imprime o erro se for o caso 
ou redireciona para a index novamente para que vejamos a lista atualizada. */
	router.post('/newMachine', function(req, res) {
  var nome = req.body.nome;
  var events_id = parseInt(req.body.events_id);
  global.db.insert({nome, events_id}, (err, result) => {
          if(err) { return console.log(err); }
          res.redirect('/');
      })
})

/* Nessa rota pedimos ao db que encontre a máquina cujo id veio como parâmetro 
da requisição (req.params.id). Após ele encontrar o dito cujo, 
mandamos renderizar a mesma view de cadastro, porém 
com um model inteiramente novo contendo apenas um documento 
(a máquina a ser editada) e a action do form da view ‘newMachine.ejs’. */
router.get('/editMachine/:id', function(req, res, next) {
  var id = req.params.id;
  global.db.findOne(id, (e, docs) => {
      if(e) { return console.log(e); }
      res.render('newMachine', { title: 'Edição de Máquinas', doc: docs[0], action: '/editMachine/' + docs[0]._id });
    });
})

/*Aqui foi carreguado o id que veio como parâmetro na URL, e o dado de nome no body da requisição 
(pois foi postado via formulário). Apenas foi passado esse dado nas posição correta
da função de update e passando um callback bem simples parecido com os anteriores, 
mas que redireciona o usuário para a index do projeto em caso de sucesso, voltando à listagem. */
router.post('/editMachine/:id', function(req, res) {
  var id = req.params.id;
  var nome = req.body.nome;
  var events_id = parseInt(req.body.events_id);
  global.db.update(id, {nome,events_id}, (e, result) => {
        if(e) { return console.log(e); }
        res.redirect('/');
    });
});

/* Nessa rota, após excluirmos a máquina usando a função da variável global.db, 
redirecionamos o usuário de volta à tela de listagem para que a mesma se mostre atualizada. */
router.get('/deleteMachine/:id', function(req, res) {
  var id = req.params.id;
  global.db.deleteOne(id, (e, r) => {
        if(e) { return console.log(e); }
        res.redirect('/');
      });
});

/* Essa rota recebe a quantidade de máquinas na base através de um await
(pois a função countAll é assíncrona, e é necessário usar await para esperar seu retorno). 
A cereja do bolo fica para o cálculo de quantidade de páginas que fizemos ali, 
dividindo o total de documentos pelo tamanho da página, usando a constante existente no módulo db.js. */
router.get('/:pagina?', async function(req, res) {
  const pagina = parseInt(req.params.pagina || "1");
  const docs = await global.db.findAll(pagina);
  const count = await global.db.countAll();
  const qtdPaginas = Math.ceil(count / global.db.TAMANHO_PAGINA);
  res.render('index', { title: 'Lista de Máquinas', docs, count, qtdPaginas, pagina });
})

module.exports = router;

