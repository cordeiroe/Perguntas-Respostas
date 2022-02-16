
//Declaração das constantes a serem usadas no projeto
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const askModel = require("./database/Model-ask");
const Pergunta = require("./database/Model-ask");

//Conexão do db
connection
    .authenticate()
    .then(()=> { //SE a autenticação for verdadeira, o código a ser realizado é este
        console.log("Conexão realizada com o DB");
    })
    .catch((err)=> { //SE houver algum erro na autenticação, o código a ser realziado é este 

        console.log(err)

    })

//Informando que o Express deve usar EJS como View Engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) =>{
   
    res.render("index");

});

app.get("/perguntar", (req,res) => {
    
    res.render("perguntar");

})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({

        titulo: titulo,
        descricao: descricao

    }).then(()=> {
        res.redirect("/");
    });

});

app.listen(3000, () =>{

    console.log("Server on");

});