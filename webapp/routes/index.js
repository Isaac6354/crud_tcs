var express = require('express');
var router = express.Router();

//Rota para renderizar a página de controle do simulador de eventos
router.get('/newEvent', function(req, res){
    res.render('newEvent', { titleEvents: 'Controle de Eventos' });
});

/* A rota GET acessa a página newMachine quando acessamos /showMachines/newMachine no navegador */
router.get('/showMachines/newMachine', function(req, res, next) {
  res.render('newMachine', { title: 'Novo Cadastro de Máquina', doc: {"idMaquina":"","NomeMaquina":""}, action: '/showMachines/newMachine' });
});

// Machine Status Collection
router.get('/showStatus/newStatus', function(req, res, next) {
    res.render('newStatus', { title: 'Novo Cadastro de Status', doc: {"idStatus":"","descricaoStatus":""}, action: '/showStatus/newStatus' });
});

/* Sensor Events Collection
router.get('/newEvent', function(req, res, next) {
    res.render('newEvent', { titleEvents: 'Controle de Eventos', doc: {"idMaquina":"","idStatus":"","data_Hora":""}, action: '/newEvent' });
});*/

// Sensor Events Collection
router.post('/newEvent', (req, res) => {
    const idMaquina = {idMaquina: 1};
    const idStatus = {idStatus: 2};
    const data_Hora = {data_Hora: new Date()};
    console.log(idMaquina,idStatus,data_Hora );
    console.log(db);
  
    db.collection('sensorEvents').save(idMaquina,idStatus,data_Hora, (err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log('evento adicionado no banco');
      res.sendStatus(201);
    });
});

/* Essa rota quando acessada via POST, chama o objeto global db para salvar os dados no Mongo. 
A rota será a mesma /showMachines/newMachine, porém com o verbo POST. Pego os dados que foram postados no body
da requisição HTTP usando o objeto req (request/requisição) depois crio um JSON 
com essas duas variáveis e envio para função insert. Na função de callback exigida pelo insert 
existe uma validação que imprime o erro se for o caso 
ou redireciona para a index novamente para que vejamos a lista atualizada. */
router.post('/showMachines/newMachine', function(req, res) {
    var idMaquina = parseInt(req.body.idMaquina); 
    var NomeMaquina = req.body.NomeMaquina;
    global.db.insertOne({idMaquina,NomeMaquina}, (err, result) => {
        if(err) { return console.log(err); }
        res.redirect('/showMachines');
    })
})

// Machine Status Collection
router.post('/showStatus/newStatus', function(req, res) {
    var idStatus = parseInt(req.body.idStatus); 
    var descricaoStatus = req.body.descricaoStatus;
    global.db.insertOneStatus({idStatus,descricaoStatus}, (err, result) => {
        if(err) { return console.log(err); }
        res.redirect('/showStatus');
    })
})

//Sensor Events Collection
router.post('/newEvent', function(req, res) {
    var idMaquina = parseInt(req.body.idMaquina); 
    var idStatus = parseInt(req.body.idStatus);
    var data_Hora = req.body.idMaquina;
    global.db.insertOneEvent({idMaquina,idStatus,data_Hora}, (err, result) => {
        if(err) { return console.log(err); }
        res.redirect('/newEvent');
    })
})

/* Nessa rota pedimos ao db que encontre a máquina cujo id veio como parâmetro 
da requisição (req.params.id). Após ele encontrar o dito cujo, 
mandamos renderizar a mesma view de cadastro, porém 
com um model inteiramente novo contendo apenas um documento 
(a máquina a ser editada) e a action do form da view ‘newMachine.ejs’. */
router.get('/showMachines/editMachine/:id', function(req, res, next) {
    var id = req.params.id;
    global.db.findOne(id, (e, docs) => {
        if(e) { return console.log(e); }
        res.render('newMachine', { title: 'Edição de Máquinas', doc: docs[0], action: '/showMachines/editMachine/' + docs[0]._id });
    });
})

// Machine Status Collection
router.get('/showStatus/editStatus/:id', function(req, res, next) {
    var id = req.params.id;
    global.db.findOneStatus(id, (e, status) => {
        if(e) { return console.log(e); }
        res.render('newStatus', { title: 'Edição de Status', doc: status[0], action: '/showStatus/editStatus/' + status[0]._id });
    });
})

/*Aqui foi carreguado o id que veio como parâmetro na URL, e o dado de nome no body da requisição 
(pois foi postado via formulário). Apenas foi passado esse dado nas posição correta
da função de update e passando um callback bem simples parecido com os anteriores, 
mas que redireciona o usuário para a index do projeto em caso de sucesso, voltando à listagem. */
router.post('/showMachines/editMachine/:id', function(req, res) {
    var id = req.params.id;
    var idMaquina = parseInt(req.body.idMaquina);
    var NomeMaquina = req.body.NomeMaquina;
    global.db.update(id, {idMaquina,NomeMaquina}, (e, result) => {
        if(e) { return console.log(e); }
        res.redirect('/showMachines');
    });
});

// Machine Status Collection
router.post('/showStatus/editStatus/:id', function(req, res) {
    var id = req.params.id;
    var idStatus = parseInt(req.body.idStatus);
    var descricaoStatus = req.body.descricaoStatus;
    global.db.updateStatus(id, {idStatus,descricaoStatus}, (e, result) => {
        if(e) { return console.log(e); }
        res.redirect('/showStatus');
    });
});

/* Nessa rota, após excluirmos a máquina usando a função da variável global.db, 
redirecionamos o usuário de volta à tela de listagem para que a mesma se mostre atualizada. */
router.get('/showMachines/deleteMachine/:id', function(req, res) {
    var id = req.params.id;
    global.db.deleteOne(id, (e, r) => {
        if(e) { return console.log(e); }
        res.redirect('/showMachines');
    });
});

// Machine Status Collection
router.get('/showStatus/deleteStatus/:id', function(req, res) {
    var id = req.params.id;
    global.db.deleteOneStatus(id, (e, r) => {
        if(e) { return console.log(e); }
        res.redirect('/showStatus');
    });
});

/* Essa rota recebe a quantidade de máquinas na base através de um await
(pois a função countAll é assíncrona, e é necessário usar await para esperar seu retorno). 
A cereja do bolo fica para o cálculo de quantidade de páginas que fizemos ali, 
dividindo o total de documentos pelo tamanho da página, usando a constante existente no módulo db.js. */
router.get('/showMachines/:pagina?', async function(req, res) {
    const pagina = parseInt(req.params.pagina || "1");
    const docs = await global.db.findAll(pagina);
    const count = await global.db.countAll();
    const qtdPaginas = Math.ceil(count / global.db.TAMANHO_PAGINA);
    res.render('showMachines', { title: 'Lista de Máquinas', docs, count, qtdPaginas, pagina });
}) 

// Machine Status Collection
router.get('/showStatus/:paginaStatus?', async function(req, res) {
    const paginaStatus = parseInt(req.params.paginaStatus || "1");
    const status = await global.db.findAllStatus(paginaStatus);
    const countStatus = await global.db.countAllStatus();
    const qtdPaginasStatus = Math.ceil(countStatus / global.db.PAGE_SIZE);
    res.render('showStatus', { title: 'Lista de Status', status, countStatus, qtdPaginasStatus, paginaStatus });
})
	
// Sensor Events Collection
router.get('/:paginaEvents?', async function(req, res) {
    const paginaEvents = parseInt(req.params.paginaEvents || "1");
    const events = await global.db.findAllEvents(paginaEvents);
    const countEvents = await global.db.countAllEvents();
    const qtdPaginasEvents = Math.ceil(countEvents / global.db.PAGE_SIZE_EVENTS);
    res.render('index', { title: 'Lista de Eventos', events, countEvents, qtdPaginasEvents, paginaEvents });
})

/* Rota para chamar a função que faz um join entre a coleção machines e machineStatus
router.get('/', (req, res, next) => {
    getMachineByLastStatus(req.params.idMaquina, req.params.idStatus, (err, sensorEvents) => {
        if(err) return next(err);
        res.json(sensorEvents)
    });
})
*/

module.exports = router;

