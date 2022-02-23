
//Declaração das constantes a serem usadas no projeto
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Model-ask");
const Resposta = require("./database/Resposta");

//Conexão do db
connection
    .authenticate()
    .then(()=> { //SE a autenticação for verdadeira, o código a ser realizado é este
        console.log("Conexão realizada com o DB");
    })
    .catch((err)=> { //SE houver algum erro na autenticação, o código a ser realziado é este 

        console.log(err)

    });

//Informando que o Express deve usar EJS como View Engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) =>{

   Pergunta.findAll({ raw: true, order: [['createdAt', 'DESC']]}).then(perguntas => {

        res.render("index", {

            perguntas: perguntas

        });

   });

});

app.get("/perguntar", (req,res) => {
    
    res.render("perguntar");

});

app.post("/salvarpergunta", (req, res) => {
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    Pergunta.create({

        titulo: titulo,
        descricao: descricao

    }).then(()=> {
        res.redirect("/");
    });

});


app.get("/pergunta/:id", (req, res) => {
    let id = req.params.id;

    Pergunta.findOne({

        where: {id: id}

    }).then(pergunta => {

        if (pergunta != undefined){

            Resposta.findAll({

                where: {perguntaId: pergunta.id},
                order: [['createdAt','DESC']]

            }).then(respostas => {

                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });

            });
         
        } else {

            res.redirect("/");
            
        }

    });
});


app.post("/responder", (req, res) =>{

    let corpo = req.body.corpo;
    let perguntaId = req.body.perguntaId;

    Resposta.create({

        corpo: corpo,
        perguntaId: perguntaId

    }).then(()=> {

        res.redirect("/pergunta/"+ perguntaId);

    });
    
});

app.listen(3000, () =>{

    console.log("Server on");

});