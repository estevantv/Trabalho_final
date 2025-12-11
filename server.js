import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";

const __dirname = path.resolve();
const PORT = 3000;
const host = "0.0.0.0";

let ListaEquipes = [];
let ListaPlayers = [];

const server = express();
server.use(express.static(__dirname));

server.use(express.static(path.join(__dirname, "css")));

server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(session({
    secret: "Senhatest",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15 }
}));



server.get("/login", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body style="display: flex;justify-content: center;align-items: center;height: 100vh;margin: 0;background-color: #8d8e8f;">
    <div class="container w-25" style="background-color: rgb(199, 199, 199); border-radius: 15px;box-shadow: 0 5px 15px rgba(27, 25, 31, 0.3); border: solid 3px black;">
        <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
            <fieldset class="border p-2">
                <legend class="mb-3">Login do administrador</legend>
                <div class="col-md-12">
                    <label for="nome" class="form-label">Nome de Usuário:</label>
                    <input type="text" class="form-control" id="nome" name="nome" required>
                </div>
                <div class="col-md-12">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" required>
                </div>
                <div class="col-12 mt-2">
                    <button class="btn btn-primary" type="submit">Login</button>
                </div>
            </fieldset>
        </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>
</html>`);
});

server.post("/login", (req, res) => {
    const { nome, senha } = req.body;

    if (nome === "admin" && senha === "senha") {
        req.session.dadosLogin = {
            nome: "Administrador",
            logado: true
        };
        res.redirect("/");
    } 
    else {
        res.send(`<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="display: flex;justify-content: center;align-items: center;height: 100vh;margin: 0;background-color: #8d8e8f;">
    <div class="container w-25" style="background-color: rgb(199, 199, 199); border-radius: 15px; box-shadow: 0 5px 15px rgba(27, 25, 31, 0.3); border: solid 3px black;">
        <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
            <fieldset class="border p-2">
                <legend class="mb-3">Login do administrador</legend>

                <div class="col-md-12">
                    <label for="nome" class="form-label">Nome de Usuário:</label>
                    <input type="text" class="form-control" id="nome" name="nome" required>
                </div>

                <div class="col-md-12">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" required>
                </div>

                <div class="col-12 mt-2">
                    <button class="btn btn-primary" type="submit">Login</button>
                </div>
            </fieldset>
        </form>
    </div>
</body>
</html>`);
    }
});
server.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

function verificarUsuarioLogado(req, res, proximo) {
    if (req.session.dadosLogin?.logado) {
        return proximo();
    } else {
        return res.redirect("/login");
    }
}




server.get("/",verificarUsuarioLogado, (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
      rel="stylesheet">
    <link rel="stylesheet" href="/css_menu.css">
</head>
<body>
    <div class="top"><h1>Menu do sistema</h1><br><br><br><br>
     <p class="last-access">Último acesso: <span id="lastAccess"></span></p>
    </div>
 <div class="buttons text-center mt-5">
        <a href="Cadastro_time" class="btn btn-outline-primary mx-3">Cadastro do time</a>
        <a href="/Cadastro_player" class="btn btn-outline-success mx-3">Cadastro do jogador</a>
    </div>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <div style="padding-left: 50%">
    <a href="/logout" class="btn btn-outline-danger";>Logout</a></div>
</body>
</html>`);
});


server.get("/Cadastro_time", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro do time</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="login-box">
                <form action="/Cadastro_time" method="POST" novalidate>
                    <label for="equipe">Nome da equipe:</label>
                    <input type="text" id="equipe" name="equipe" required>

                    <label for="cap">Nome do capitão:</label>
                    <input type="text" id="cap" name="cap" required>

                    <label for="ctt">Telefone de Contato:</label>
                    <input type="text" id="ctt" name="ctt" required>

                    <button type="submit" class="submit-btn">Enviar</button>
                </form>
            </div>
        </body>
        </html>
    `);
});


server.post("/Cadastro_time", verificarUsuarioLogado, (req, res) => {
    const nome = req.body.equipe;
    const cap = req.body.cap;
    const ctt = req.body.ctt;

    if(nome && cap && ctt){
        console.log("Dados recebidos:", req.body);
        ListaEquipes.push({nome, cap, ctt});
        return res.redirect("/ListarEquipes");
    } else {
        let conteudo = `<!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro do time</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="login-box">
                <form action="/Cadastro_time" method="POST" novalidate>
                    <label for="equipe">Nome da equipe:</label>
                    <input type="text" id="equipe" name="equipe" required value="${nome || ''}">`;

        if(!nome){
            conteudo += `<div><p class="text-danger">Informe o nome da equipe!</p></div>`;
        }

        conteudo += `<label for="cap">Nome do capitão:</label>
                     <input type="text" id="cap" name="cap" required value="${cap || ''}">`;

        if(!cap){
            conteudo += `<div><p class="text-danger">Informe o nome do capitão!</p></div>`;
        }

        conteudo += `<label for="ctt" class="form-label mt-3">Telefone de Contato:</label>
                     <input type="text" class="form-control" id="ctt" name="ctt" required value="${ctt || ''}">`;

        if(!ctt){
            conteudo += `<div><p class="text-danger">Informe o telefone de contato!</p></div>`;
        }

        conteudo += `<br><br><button type="submit" class="submit-btn">Enviar</button>
                </form>
            </div>
        </body>
        </html>`;

        res.send(conteudo);
    }
});

server.get("/Cadastro_player", (req, res) => {
    let conteudo=`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de jogador</title>
    <link rel="stylesheet" href="/CP_CSS.css">
</head>
 <br>
    <br>
    <br>
    <h1>Cadastro do Jogador</h1>
<div class="login-box">
    <form action="/Cadastro_player" method="POST" novalidate>
<br><br>
    <div class="linha">
        <div class="lado">
            <label for="nome">Nome do Jogador:</label>
            <input type="text" id="nome" name="nome" required>
        </div>

        <div class="lado">
            <label for="nick">Nickname in-game:</label>
            <input type="text" id="nick" name="nick" required>
        </div>
    </div>
<br><br>
    <div class="linha">
        <div class="lado">
            <label for="posicao">Posição na equipe:</label>
            <select class="form-select" id="func" name="func">
                                        <option selected disabled value=""> </option>
                                        <option value="Toplaner">Toplaner</option>
                                        <option value="Jungler">Jungler</option>
                                        <option value="Midlaner">Midlaner</option>
                                        <option value="Atirador">Atirador</option>
                                        <option value="Suporte">Suporte</option>
                                    </select>
        </div>

        <div class="lado">
            <label for="genero">Gênero:</label>
            <input type="text" id="gender" name="gender" required>
        </div>
    </div>
<br><br>
    <div class="linha">
        <div class="lado">
            <label for="time">Nome do time:</label>
            <select name="team" id="team">`;
    for(let i=0;i<ListaEquipes.length;i++){
        conteudo+=`
        <option>${ListaEquipes[i].nome}</option>
        `;
    }        
            conteudo+=`
        </select></div>
           <div class="lado">
            <label for="Elo">Elo:</label>
               <select class="form-select" id="elo" name="elo">
                                   <option selected disabled value=""> </option>
                                        <option value="Sem elo">Sem elo</option>
                                        <option value="Ferro">Ferro</option>
                                        <option value="Bronze">Bronze</option>
                                        <option value="Prata">Prata</option>
                                        <option value="Ouro">Ouro</option>
                                        <option value="Esmeralda">Esmeralda</option>
                                        <option value="Platina">Platina</option>
                                        <option value="Diamante">Diamante</option>
                                        <option value="Mestre">Mestre</option>
                                        <option value="Grão-Mestre">Grão-Mestre</option>
                                        <option value="Chalenger">Chalenger</option>
                                    </select>
        </div>
    </div>
    

    <button type="submit" class="submit-btn">Enviar</button>

</form>

</div>
    
</body>
</html>
    `;res.send(conteudo);
});


server.post("/Cadastro_player", verificarUsuarioLogado, (req, res) => {
    const nome = req.body.nome;
    const nick = req.body.nick;
    const func = req.body.func;
    const gen = req.body.gender;
    const time = req.body.team;
    const elo = req.body.elo;

    if(nome && nick && func && gen && time && elo){
        console.log("Dados recebidos:", req.body);
       ListaPlayers.push({ nome, nick, func, gen, time, elo });
        return res.redirect("/ListarPlayers");
    } else {
        let conteudo = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de jogador</title>
    <link rel="stylesheet" href="/CP_CSS.css">
</head>
 <br>
    <br>
    <br>
    <h1>Cadastro do Jogador</h1>
<div class="login-box">
    <form action="/Cadastro_player" method="POST" novalidate>
<br><br>
    <div class="linha">
        <div class="lado">
            <label for="nome">Nome do Jogador:</label>
            <input type="text" id="nome" name="nome" required value="${nome || ''}">`;

        if(!nome){
            conteudo += `<div><p class="text-danger">Informe o nome!</p></div>`;
        }

        conteudo += `     </div>

        <div class="lado">
            <label for="nick">Nickname in-game:</label>
            <input type="text" id="nick" name="nick" required value="${nick || ''}">`;

        if(!nick){
            conteudo += `<div><p class="text-danger">Informe o nick in-game!</p></div>`;
        }

        conteudo += `</div>
    </div>
<br><br>
    <div class="linha">
        <div class="lado">
            <label for="posicao">Posição na equipe:</label>
            <select class="form-select" id="func" name="func" value="${func || ''}">
                                        <option selected disabled value=""> </option>
                                        <option value="Toplaner">Toplaner</option>
                                        <option value="Jungler">Jungler</option>
                                        <option value="Midlaner">Midlaner</option>
                                        <option value="Atirador">Atirador</option>
                                        <option value="Suporte">Suporte</option>
                                    </select>`

        if(!func){
            conteudo += `<div><p class="text-danger">Informe a posição na equipe!</p></div>`;
        }

        conteudo += `</div>

        <div class="lado">
            <label for="genero">Gênero:</label>
            <input type="text" id="gender" name="gender" required value="${gen || ''}">`;

            if(!gen){
                 conteudo += `<div><p class="text-danger">Informe o gênero!</p></div>`;
            }
            conteudo +=`</div>
    </div>
<br><br>
    <div class="linha">
        <div class="lado">
            <label for="time">Nome do time:</label>
            <select name="team" id="team" value="${time || ''}">`
             for(let i=0;i<ListaEquipes.length;i++){
        conteudo+=`
        <option>${ListaEquipes[i].nome}</option>`;}
        conteudo+=`</select>`;
        if(!time){
            conteudo += `<div><p class="text-danger">Informe o Time!</p></div>`;
        }
        conteudo+=`</div>
           <div class="lado">
            <label for="Elo">Elo:</label>
               <select class="form-select" id="elo" name="elo" value="${elo || ''}">
                                   <option selected disabled value=""> </option>
                                        <option value="Sem elo">Sem elo</option>
                                        <option value="Ferro">Ferro</option>
                                        <option value="Bronze">Bronze</option>
                                        <option value="Prata">Prata</option>
                                        <option value="Ouro">Ouro</option>
                                        <option value="Esmeralda">Esmeralda</option>
                                        <option value="Platina">Platina</option>
                                        <option value="Diamante">Diamante</option>
                                        <option value="Mestre">Mestre</option>
                                        <option value="Grão-Mestre">Grão-Mestre</option>
                                        <option value="Chalenger">Chalenger</option>
                                    </select>`

                                    if(!elo){
                                        conteudo += `<div><p class="text-danger">Informe o Elo!</p></div>`;
                                    }

        conteudo+=`</div>
    </div>
    

    <button type="submit" class="submit-btn">Enviar</button>

</form>

</div>
    
</body>
</html>`;
                                
res.send(conteudo);}});


// Listar equipes
server.get("/ListarEquipes", (req, res) => {
   
    let conteudo=`<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Lista de usuários no Sistema</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Lista de Usuários</h1>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Nome da equipe</th>
                                <th>Nome do capitão</th>
                                <th>Contato</th>
                            </tr>
                        </thead>
                        <tbody>`
                        for(let i=0;i<ListaEquipes.length;i++){

conteudo +=`
<tr>
<td>${ListaEquipes[i].nome}</td>
<td>${ListaEquipes[i].cap}</td>
<td>${ListaEquipes[i].ctt}</td>
</tr>
`;
}
conteudo+=`</tbody>
                    </table>
                    <a class="btn btn-secondary" href="/">Voltar</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>`; res.send(conteudo);});

// Listar equipes
server.get("/ListarPlayers", (req, res) => {
   
    let conteudo=`<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Lista de usuários no Sistema</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Lista de Usuários</h1>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Nome da Jogador</th>
                                <th>Nick in-game</th>
                                <th>Posição na equipe</th>
                                <th>Gênero</th>
                                <th>Elo</th>
                                <th>Nome do time</th>
                            </tr>
                        </thead>
                        <tbody>`
                        for(let i=0;i<ListaPlayers.length;i++){

conteudo +=`
<tr>
<td>${ListaPlayers[i].nome}</td>
<td>${ListaPlayers[i].nick}</td>
<td>${ListaPlayers[i].func}</td>
<td>${ListaPlayers[i].gen}</td>
<td>${ListaPlayers[i].elo}</td>
<td>${ListaPlayers[i].time}</td>

</tr>
`;
}
conteudo+=`</tbody>
                    </table>
                    <a class="btn btn-secondary" href="/">Voltar</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>`;res.send(conteudo);});



// Start server
server.listen(PORT, host, () => {
    console.log(`Servidor funcionando na URL: http://${host}:${PORT}`);
});
