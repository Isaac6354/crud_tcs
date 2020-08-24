var express = require('express');
var router = express.Router();

// Machine Status Collection
router.get('/showStatus/newStatus', function(req, res, next) {
  res.render('newStatus', { title: 'Novo Cadastro de Status', doc: {"idStatus":"","descricaoStatus":""}, action: '/showStatus/newStatus' });
});

// Machine Status Collection
router.post('/showStatus/newStatus', function(req, res) {
    var idStatus = parseInt(req.body.idStatus); 
    var descricaoStatus = req.body.descricaoStatus;
    global.db.insertOneStatus({idStatus,descricaoStatus}, (err, result) => {
        if(err) { return console.log(err); }
        res.redirect('/showStatus');
    })
})

// Machine Status Collection
router.get('/showStatus/editStatus/:id', function(req, res, next) {
    var id = req.params.id;
    global.db.findOneStatus(id, (e, status) => {
        if(e) { return console.log(e); }
        res.render('newStatus', { title: 'Edição de Status', doc: status[0], action: '/showStatus/editStatus/' + status[0]._id });
    });
})

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

// Machine Status Collection
router.get('/showStatus/deleteStatus/:id', function(req, res) {
    var id = req.params.id;
    global.db.deleteOneStatus(id, (e, r) => {
        if(e) { return console.log(e); }
        res.redirect('/showStatus');
    });
});

// Machine Status Collection
router.get('/showStatus/:paginaStatus?', async function(req, res) {
    const paginaStatus = parseInt(req.params.paginaStatus || "1");
    const status = await global.db.findAllStatus(paginaStatus);
    const countStatus = await global.db.countAllStatus();
    const qtdPaginasStatus = Math.ceil(countStatus / global.db.PAGE_SIZE);
    res.render('showStatus', { title: 'Lista de Status', status, countStatus, qtdPaginasStatus, paginaStatus });
})

module.exports = router;

