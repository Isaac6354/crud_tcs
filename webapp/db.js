/* Estas linhas carregam o objeto mongoClient  a partir do módulo ‘mongodb’ 
e depois fazem uma conexão em nosso banco de dados localhost */

const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost", { useUnifiedTopology: true })
            .then(conn => global.conn = conn.db("webapp"))
            .catch(err => console.log(err))

/* Nessa função foi defininda uma constante com o tamanho das páginas sendo 5. 
Depois, adicionei um novo parâmetro na função findAll que espera a página que a aplicação 
deseja apresentar. Este parâmetro eu uso para calcular o skip, ou seja, 
quantos elementos da consulta eu devo ignorar. 
Se a página for a primeira, o skip será zero e serão mostrados os primeiros 10 elementos. 
Se a página for a segunda, o skip será 10 pela fórmula 
e serão mostrados os elementos das posições 11 a 20 (ordinal, ou 10 a 19 considerando um array zero-based). */          	
const TAMANHO_PAGINA = 5;
function findAll(pagina){ 
    const tamanhoSkip = TAMANHO_PAGINA * (pagina - 1); 
    return global.conn.collection("machines")
        .find({}).
         skip(tamanhoSkip)
        .limit(TAMANHO_PAGINA)
        .toArray(); 
}

//Status collection
const PAGE_SIZE = 5;
function findAllStatus(paginaStatus){ 
    const tamanhoSkipStatus = PAGE_SIZE * (paginaStatus - 1); 
    return global.conn.collection("machineStatus")
        .find({}).
         skip(tamanhoSkipStatus)
        .limit(PAGE_SIZE)
        .toArray(); 
}

//Sensor events collection
const PAGE_SIZE_EVENTS = 5;
function findAllEvents(paginaEvents){ 
    const tamanhoSkipEvents = PAGE_SIZE_EVENTS * (paginaEvents - 1); 
    return global.conn.collection("sensorEvents")
        .find({}).
         skip(tamanhoSkipEvents)
        .limit(PAGE_SIZE_EVENTS)
        .toArray(); 
}

/* Insere máquinas usando a conexão global e, 
novamente, executando um callback ao seu término */
function insertOne(machine, callback){
    global.conn.collection("machines").insert(machine, callback);
}

//Status collection
function insertOneStatus(machineStatus, callback){
    global.conn.collection("machineStatus").insert(machineStatus, callback);
}

//sensorEvents collection
function insertOneEvent(sensorEvents, callback){
    global.conn.collection("sensorEvents").insert(sensorEvents, callback);
}

/* Essa função retorna apenas uma máquina, baseada em seu _id. Como nosso filtro do find será o id, 
ele deve ser convertido para ObjectId, pois virá como string na URL 
e o Mongo não entende Strings como _ids. */
var ObjectId = require("mongodb").ObjectId;
function findOne(id, callback){  
    global.conn.collection("machines").find(new ObjectId(id)).toArray(callback);
}

//Status collection
var ObjectId = require("mongodb").ObjectId;
function findOneStatus(id, callback){  
    global.conn.collection("machineStatus").find(new ObjectId(id)).toArray(callback);
}

/* Essa função passa o filtro do update para saber qual documento será afetado 
(neste caso somente aquele que possui o id específico). */
function update(id, machine, callback){
    global.conn.collection("machines").updateOne({_id: new ObjectId(id)}, {$set: machine}, callback);
}

//Status collection
function updateStatus(id, machineStatus, callback){
    global.conn.collection("machineStatus").updateOne({_id: new ObjectId(id)}, {$set: machineStatus}, callback);
}

//Machine collection
function deleteOne(id, callback){
    global.conn.collection("machines").deleteOne({_id: new ObjectId(id)}, callback);
}

//Status collection
function deleteOneStatus(id, callback){
    global.conn.collection("machineStatus").deleteOne({_id: new ObjectId(id)}, callback);
}

/* Essa função retorna a quantidade de documentos na coleção machines. */
function countAll(){  
    return global.conn.collection("machines").countDocuments();
}

//status collection
function countAllStatus(){  
    return global.conn.collection("machineStatus").countDocuments();
}

//Sensor events collection
function countAllEvents(){  
    return global.conn.collection("sensorEvents").countDocuments();
}

/* Função que faz um join entre a coleção machines e machineStatus
function getMachineByLastStatus(idMaquina, idStatus, callback){
    var objIdMaquina = ObjectId(idMaquina);
    var objIdStatus = ObjectId(idStatus);

    mongodb.connect((err, db) => {
        db.collection("machines").aggregate([
            {$match: {"idMaquina": objIdMaquina}},
            {$unwind: "$machines.NomeMaquina"},
            {$match: {"machineStatus.idStatus": objIdStatus}},
            {$unwind: "$machineStatus.descricaoStatus"},
            {$group: {_id: { idMaquina: "$machines.idMaquina", NomeMaquina: "$machines.NomeMaquina"}}}
        ]).toArray((err, sensorEvents) => {
            if(err) return callback(err, null);
            callback(err, sensorEvents.map(item => { return {idMaquina: item.idMaquina, idStatus: item._id.idStatus, data_Hora: item.data_Hora }}));
        });
    });
}*/

module.exports = { findAll, insertOne, findOne, update, deleteOne, countAll, TAMANHO_PAGINA, findAllStatus, insertOneStatus, findOneStatus, updateStatus, deleteOneStatus, countAllStatus, PAGE_SIZE, insertOneEvent, findAllEvents, countAllEvents, PAGE_SIZE_EVENTS }
