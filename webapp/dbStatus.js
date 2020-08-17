/* Estas linhas carregam o objeto mongoClient  a partir do módulo ‘mongodb’ 
e depois fazem uma conexão em nosso banco de dados localhost */

const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost", { useUnifiedTopology: true })
            .then(conn => global.conn = conn.db("webapp"))
            .catch(err => console.log(err))

/*//Status collection
const TAMANHO_PAGINA = 5; 
function findAll(pagina){ 
    const tamanhoSkip = TAMANHO_PAGINA * (pagina - 1); 
    return global.conn.collection("status")
        .find({}).
        skip(tamanhoSkip)
        .limit(TAMANHO_PAGINA)
        .toArray(); 
}*/

//Status collection
function findAllStatus(callback){  
    global.conn.collection("status").find({}).toArray(callback);
}

//Status collection
function insertStatus(status, callback){
    global.conn.collection("status").insert(status, callback);
}

//Status collection
var ObjectId = require("mongodb").ObjectId;
function findOneStatus(id, callback){  
    global.conn.collection("status").find(new ObjectId(id)).toArray(callback);
}

//Status collection
function updateStatus(id, status, callback){
    global.conn.collection("status").updateOne({_id: new ObjectId(id)}, {$set: status}, callback);
}

//Status collection
function deleteOneStatus(id, callback){
    global.conn.collection("status").deleteOne({_id: new ObjectId(id)}, callback);
}

//status collection
function countAllStatus(){  
    return global.conn.collection("status").countDocuments();
}

module.exports = { findAllStatus, insertStatus, findOneStatus, updateStatus, deleteOneStatus, countAllStatus }
