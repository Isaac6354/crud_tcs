var express = require('express');
var router = express.Router();

//Rota para renderizar a página de controle do simulador de eventos
router.get('/newEvent', function(req, res){
  res.render('newEvent', { titleEvents: 'Controle de Eventos' });
});

/* A rota GET acessa a página newevent quando acessamos /newEvent no navegador 
router.get('/newEvent', function(req, res, next) {
    res.render('newEvent', { titleEvents: 'Controle de Eventos', doc: {"idMaquina":"","idStatus":"","data_Hora":""}, action: '/newEvent' });
});*/

/* Essa rota quando acessada via POST, chama o objeto global db para salvar os dados no Mongo. 
A rota será a mesma /showMachines/newMachine, porém com o verbo POST. Pego os dados que foram postados no body
da requisição HTTP usando o objeto req (request/requisição) depois crio um JSON 
com essas duas variáveis e envio para função insert. Na função de callback exigida pelo insert 
existe uma validação que imprime o erro se for o caso 
ou redireciona para a index novamente para que vejamos a lista atualizada. 
router.post('/newEvent', function(req, res) {
    var idMaquina = parseInt(req.body.idMaquina); 
    var idStatus = parseInt(req.body.idStatus);
    var data_Hora = req.body.idMaquina;
    global.db.insertOneEvent({idMaquina,idStatus,data_Hora}, (err, result) => {
        if(err) { return console.log(err); }
        res.redirect('/newEvent');
    })
})*/

/* SensorEvents collection
router.get('/events', function autoInsert(req, res){
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

const url = 'mongodb://localhost:3000';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {

    if (err) throw err;

    const db = client.db("webApp");

    let doc = {_id: new ObjectID(), idMaquina: 1, idStatus: 2, data_Hora: new Date()};

    db.collection('sensorEvents').insertOne(doc).then((doc) => {

        console.log('Event inserted')
        console.log(doc);
    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });
});
    res.render('events', { titleEvents: 'Controle de Eventos', doc: {"idMaquina":"","NomeMaquina":"","data_Hora":""}, action: '/events' });
});*/

/*var events = ['teste'];

function autoInsert(){
    var randomEvent = Math.floor(Math.random() * (events.length));
    document.getElementById(showEvents).innerHTML = events[randomEvent];
}*/

/*
<!DOCTYPE html>
<html>
  <head>
    <title><%= titleEvents %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= titleEvents %></h1>
    <form action="<%= action %>" method="POST">
        <p>Código da Máquina:<input type="number" name="idMaquina" value="<%= doc.idMaquina %>" /></p>
        <p>Código do Status:<input type="text" name="idStatus" value="<%= doc.idStatus %>" /></p>
        <p>Data:<input type="date" name="data_Hora" value="<%= doc.data_Hora %>" /></p>
        <input type="submit" value="Salvar" />
      </form>
  </body>
</html>

      <form>
      <tr>
        <% for(var i = 0; i < sensorEvents.length; i++){ %>
        <%=db = db.getSiblingDB('webApp') %>
        <%=db.sensorEvents.insert({ idMaquina : 1, idStatus : 1, data_Hora: new Timestamp()}) %>
        <%=db.sensorEvents.insert({ idMaquina : 2, idStatus : 2, data_Hora: new Timestamp()}) %>
        <%=db.sensorEvents.insert({ idMaquina : 3, idStatus : 1, data_Hora: new Timestamp()}) %>
      </tr>  
        <% }) %>
        <input type="submit" value="Salvar" />
      </form>
*/

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('evento foi gerado');

  fetch('/newEvent', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('evento foi gerado');
        return;
      }
      throw new Error('falha ao gerar evento.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

// Rota para adicionar um evento através do método post no banco
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

module.exports = router;

