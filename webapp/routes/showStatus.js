var express = require('express');
var router = express.Router();

//Status collection
router.get('/newStatus', function(req, res, next) {
    res.render('newStatus', { title: 'Novo Cadastro de Status', doc: {"_id":"","nome":""}, action: '/newStatus' });
});

//Status collection
router.post('/newStatus', function(req, res) {
    var id = parseInt(req.body._id);
    var nome = req.body.nome;
    global.db.insertOneStatus({id,nome}, (err, result) => {
            if(err) { return console.log(err); }
            res.redirect('/');
        })
})

//Status collection
router.get('/editStatus/:id', function(req, res, next) {
    var id = req.params.id;
    global.db.findOneStatus(id, (e, docs) => {
        if(e) { return console.log(e); }
        res.render('newStatus', { title: 'Edição de Status', doc: docs[0], action: '/editStatus/' + docs[0]._id });
      });
})

 //Status collection
router.post('/editStatus/:id', function(req, res) {
    var id = parseInt(req.params._id);
    var nome = req.body.nome;
    global.db.updateStatus(id, {nome}, (e, result) => {
          if(e) { return console.log(e); }
          res.redirect('/');
      });
});

//Status collection
router.get('/deleteStatus/:id', function(req, res) {
    var id = req.params.id;
    global.db.deleteOneStatus(id, (e, r) => {
          if(e) { return console.log(e); }
          res.redirect('/');
        });
});

//Status collection
router.get('/', function(req, res) {
    global.db.findAllStatus((e, docs) => {
        if(e) { return console.log(e); }
        res.render('index', { title: 'Lista de Status', docs: docs });
    })
})
  
module.exports = router;

