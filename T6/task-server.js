var http = require('http')
var axios = require('axios')
var fs = require('fs') /* Para trabalhar com o File System */

var {parse} = require('querystring')
var static = require('./static')

const num_port = 7777

// Aux. Functions
// Retrieves student info from request body --------------------------------
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

function registaTask(t){

    var n = 0
    t.forEach(i => {
        if(Number(i.id) > n)
            n = Number(i.id)
    })
    var id = n + 1
    var d = new Date().toISOString().substr(0, 10)


    return `
        <div class="w3-container w3-teal" style="margin-bottom:20px">
            <h2>Create New Task</h2>
        </div>
        <form class="w3-container" action="/tasks" method="POST">
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="dateCreated" value="${d}">

            <label class="w3-text-teal"><b>Date Due:</b></label>
            <input class="w3-input w3-border w3-light-grey" type="date" name="dateDue"/>

            <label class="w3-text-teal"><b>Who:</b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="who"/>  

            <label class="w3-text-teal"><b>Task Description:</b></label><br>
            <textarea rows="5" cols="70" wrap="virtual" name="what"/></textarea><br>

            <label class="w3-text-teal"><b>Type:</b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="type"/>

            <input type="hidden" name="done" value="false">

        
            <input class="w3-btn w3-blue-grey" style="margin-top:50px" type="submit" value="Create"/>
            <input class="w3-btn w3-blue-grey" style="margin-top:50px" type="reset" value="Reset"/>     
        </form>
      `
}

function geraPag(t, d, a){

    //Header
    let pagHTML = `
      <html>
          <head>
              <title>Taskmaster</title>
              <meta charset="utf-8"/>
              <link rel="stylesheet" href="w3.css"/>
              <link rel="icon" href="favicon.png"/>
          </head>
          <body>
          `

    //Adicionar o Formulário de criar uma nova tarefa
    pagHTML += registaTask(t)

    //Enviar um alerta se a nova tarefa foi inserida com sucesso
    if(a == 1) pagHTML += `
        <div class="alert">
            <span class="closebtn" onclick="this.parentElement.style.display='none';" style="padding:20px;background-color:#008080;color:white;margin-bottom:15px;">
            &times;
            Task Registered Succefully!
            </span>
        </div>
        `
   
    //Header das tarefas por completar
    pagHTML+= `
            <div class="w3-container w3-teal" style="margin-top:50px">
                    <h2>Tasks to Do</h2>
                </div>
                <table class="w3-table w3-bordered">
                    <tr>
                        <th>Date Created</th>
                        <th>Date Due</th>
                        <th>Who</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th></th>
                        <th></th>
                    </tr>
                `
    
    //Tarefas por Completar
    t.forEach(i => {
        if(i.done == "false"){
            pagHTML += `
                <tr>
                    <td>${i.dateCreated}</td>
                    <td>${i.dateDue}</td>
                    <td>${i.who}</td>
                    <td>${i.what}</td>
                    <td>${i.type}</td>
                    <td>
                    <form class="w3-container" action="/tasks/complete/${i.id}" method="POST">
                        <input type="hidden" name="dateCreated" value="${i.dateCreated}">
                        <input type="hidden" name="dateDue" value="${d}">
                        <input type="hidden" name="who" value="${i.who}">
                        <input type="hidden" name="what" value="${i.what}">
                        <input type="hidden" name="type" value="${i.type}">
                        <input type="hidden" name="done" value="true">
                        <input class="w3-btn w3-blue-grey"  type="submit" value="Mark as finished"/>    
                    </form>
                    </td>
                    <td>
                    <form class="w3-container" action="/tasks/edit/${i.id}" method="GET">
                        <input class="w3-btn w3-blue-grey"  type="submit" value="Edit"/>    
                    </form>
                    </td>
                </tr>
                `
        }
    });

    //Header das Tarefas Completas
    pagHTML += `
              </table>
              <div class="w3-container w3-teal">
                  <h2>Completed Tasks</h2>
              </div>
              <table class="w3-table w3-bordered">
                  <tr>
                      <th>Date Created</th>
                      <th>Date Completed</th>
                      <th>Who</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th></th>
                  </tr>
    `

    //Tarefas Completas
    t.forEach(i => {
        if(i.done == "true"){
            pagHTML += `
                <tr>
                    <td>${i.dateCreated}</td>
                    <td>${i.dateDue}</td>
                    <td>${i.who}</td>
                    <td>${i.what}</td>
                    <td>${i.type}</td>
                    <td>
                    <form class="w3-container" action="/tasks/delete/${i.id}" method="GET">
                        <input class="w3-btn w3-blue-grey" type="submit" value="Delete"/>    
                    </form>
                    </td>
                </tr>
                `
        }
    });
  
    //Fim da Página
    pagHTML += `
          </table>
          <div class="w3-container w3-teal" style="margin-top:50px">
              <address>Gerado por A83870::DAW2020 em ${d} --------------</address>
          </div>
      </body>
      </html>
    `
    
    return pagHTML
    
}

function geraPagE(t, d, id){
    //Header
    let pagHTML = `
    <html>
        <head>
            <title>Taskmaster</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
            <link rel="icon" href="favicon.png"/>
        </head>
        <body>
        `

    //Adicionar o Formulário de criar uma nova tarefa
    pagHTML += registaTask(t)

    //Header das tarefas por completar
    pagHTML+= `
          <div class="w3-container w3-teal" style="margin-top:50px">
                  <h2>Tasks to Do</h2>
              </div>
              <table class="w3-table w3-bordered">
                  <tr>
                      <th>Date Created</th>
                      <th>Date Due</th>
                      <th>Who</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th></th>
                      <th></th>
                  </tr>
              `

    //Tarefas por Completar
    t.forEach(i => {
      if(i.done == "false" && i.id == id){
          pagHTML += `
            <tr>
                <form class="w3-container" action="/tasks/save" method="POST">
                    <input type="hidden" name="id" value="${id}">
                    <input type="hidden" name="dateCreated" value="${i.dateCreated}">

                    <td>
                    ${i.dateCreated}
                    </td>

                    <td>
                    <input class="w3-input w3-border w3-light-grey" type="date" name="dateDue" value="${i.dateDue}"/>
                    </td>

                    <td>
                    <input class="w3-input w3-border w3-light-grey" type="text" name="who" value="${i.who}"/> 
                    </td> 

                    <td>
                    <textarea rows="5" cols="70" wrap="virtual" name="what" value="${i.what}"/></textarea>
                    </td>

                    <td>
                    <input class="w3-input w3-border w3-light-grey" type="text" name="type" value="${i.type}"/>
                    </td>

                    <input type="hidden" name="done" value="false">

                    <td>
                    <input class="w3-btn w3-blue-grey" style="margin-top:50px" type="submit" value="Save"/>
                    </td>  
                </form>
            </tr>
            `
      }
      else if(i.done == "false" && i != id){
        pagHTML += `
        <tr>
            <td>${i.dateCreated}</td>
            <td>${i.dateDue}</td>
            <td>${i.who}</td>
            <td>${i.what}</td>
            <td>${i.type}</td>
            <td>
            </td>
            <td>
            </td>
        </tr>
        `
      }
    });

    

    //Header das Tarefas Completas
    pagHTML += `
            </table>
            <div class="w3-container w3-teal">
                <h2>Completed Tasks</h2>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>Date Created</th>
                    <th>Date Completed</th>
                    <th>Who</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th></th>
                </tr>
    `

    //Tarefas Completas
    t.forEach(i => {
      if(i.done == "true"){
          pagHTML += `
              <tr>
                  <td>${i.dateCreated}</td>
                  <td>${i.dateDue}</td>
                  <td>${i.who}</td>
                  <td>${i.what}</td>
                  <td>${i.type}</td>
                  <td>
                  <form class="w3-container" action="/tasks/delete/${i.id}" method="GET">
                      <input class="w3-btn w3-blue-grey" type="submit" value="Delete"/>    
                  </form>
                  </td>
              </tr>
              `
      }
    });

    //Fim da Página
    pagHTML += `
        </table>
        <div class="w3-container w3-teal" style="margin-top:50px">
            <address>Gerado por A83870::DAW2020 em ${d} --------------</address>
        </div>
    </body>
    </html>
    `

    return pagHTML 
}

function getHome(res, d, i){
    axios.get("http://localhost:3000/tasks?_sort=dateDue")
                        .then(response => {
                            var tarefas = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPag(tarefas, d, i))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de tarefas</p>")
                            res.end()
                        })
}

function getHomeE(res, d, id){
    axios.get("http://localhost:3000/tasks?_sort=dateDue")
                        .then(response => {
                            var tarefas = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagE(tarefas, d, id))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de tarefas</p>")
                            res.end()
                        })
}

// Criação do servidor
var taskServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req,res)
    }
    else{
        switch(req.method){
            case "GET":
                //DELETE /tasks/delete/ID
                if(/\/tasks\/delete\/[0-9]+\?/.test(req.url)){
                    let id = req.url.split("/")[3].substring(0,req.url.split("/")[3].length-1) 
                    console.log("DELETE da Tarefa " + id)
                    axios.delete('http://localhost:3000/tasks/' + id, {})
                        .then(resp => {
                            getHome(res, d, 0)
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no DELETE: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                }
                //GET Página de edição
                if(/\/tasks\/edit\/[0-9]+\?/.test(req.url)){
                    let id = req.url.split("/")[3].substring(0,req.url.split("/")[3].length-1) 
                    console.log("EDIT da Tarefa " + id)
                    getHomeE(res, d, id)
                }
                // GET /tasks
                else if(/\/(task(\/)?)?/.test(req.url)){
                    getHome(res, d, 0)
                }
                break
            case "POST":
                if(req.url == '/tasks'){
                    recuperaInfo(req, resultado => {
                        console.log('POST de Tarefa: ' + JSON.stringify(resultado))
                        axios.post('http://localhost:3000/tasks', resultado)
                            .then(resp => {
                                getHome(res, d, 1)
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                //PUT /tasks/complete/ID
                else if(/\/tasks\/complete\/[0-9]+/.test(req.url)){
                    recuperaInfo(req, resultado => {
                        console.log('PUT de Tarefa: ' + JSON.stringify(resultado))
                        axios.put('http://localhost:3000/tasks/' + req.url.split("/")[3], resultado)
                            .then(resp => {
                                getHome(res, d, 0)
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                //PUT /tasks/save
                else if(/\/tasks\/save/.test(req.url)){
                    recuperaInfo(req, resultado => {
                        console.log('SAVE: ' + JSON.stringify(resultado))
                        axios.put('http://localhost:3000/tasks/' + resultado.id, resultado)
                            .then(resp => {
                                getHome(res, d, 0)
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
    
})

taskServer.listen(num_port)
console.log('Servidor à escuta na porta ' + num_port + '...')