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
function findAllStatus(callback){  
    global.conn.collection("status").find({}).toArray(callback);
}

/* Insere máquinas usando a conexão global e, 
novamente, executando um callback ao seu término */
function insert(machine, callback){
    global.conn.collection("machines").insert(machine, callback);
}

//Status collection
function insertStatus(status, callback){
    global.conn.collection("status").insert(status, callback);
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
    global.conn.collection("status").find(new ObjectId(id)).toArray(callback);
}

/* Essa função passa o filtro do update para saber qual documento será afetado 
(neste caso somente aquele que possui o id específico). */
function update(id, machine, callback){
    global.conn.collection("machines").updateOne({_id: new ObjectId(id)}, {$set: machine}, callback);
}

//Status collection
function updateStatus(id, status, callback){
    global.conn.collection("status").updateOne({_id: new ObjectId(id)}, {$set: status}, callback);
}

//Machine collection
function deleteOne(id, callback){
    global.conn.collection("machines").deleteOne({_id: new ObjectId(id)}, callback);
}

//Status collection
function deleteOneStatus(id, callback){
    global.conn.collection("status").deleteOne({_id: new ObjectId(id)}, callback);
}

/* Essa função retorna a quantidade de documentos na coleção machines. */
function countAll(){  
    return global.conn.collection("machines").countDocuments();
}

//status collection
function countAllStatus(){  
    return global.conn.collection("status").countDocuments();
}

module.exports = { findAll, insert, findOne, update, deleteOne, countAll, TAMANHO_PAGINA, findAllStatus, insertStatus, findOneStatus, updateStatus, deleteOneStatus, countAllStatus }
