var http = require('http')
var axios =require('axios')

/*

O Dataset em questão não está na primeira forma normal, pois o atributo "instrumento" de "curso" não é um tipo básico,
mas sim um tipo de dados complexo

*/

const num_port = 4000

http.createServer(function(req,res) {
    console.log(req.method + ' ' + req.url)
    if(req.method == 'GET')
    {
        //Index
        if(req.url == '/'){
            console.log("Entrou aqui")
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })            
            res.write('<h2>Escola de Música</h2>')
            res.write('<ol>')
            res.write('<li><a href = "/alunos">Listas de Alunos</a></li>')
            res.write('<li><a href = "/cursos">Listas de Cursos</a></li>')
            res.write('<li><a href = "/instrumentos">Listas de Instrumentos</a></li>')
            res.write('</ol>')
            res.end()
        }
        
        //Lista dos Alunos
        else if(req.url == '/alunos')
        {
            axios.get('http://localhost:3000/alunos')
            .then(resp => {
                alunos = resp.data
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                })
                res.write('<h2><a href = "/alunos">Escola de Música: Lista de Alunos</a></h2>')
                res.write('<ul>')
                alunos.forEach(a => 
                {
                    res.write('<li><a href = "/alunos/' + a.id + '">' + a.id + '</a> - ' + a.nome + '</li>')
                })
                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar ao Início</a>]</address>')
                res.end()
            })
            .catch(error => {
                console.log("Erro na obtenção da lista de alunos")
            })
        }

        //Lista dos Cursos
        else if(req.url == '/cursos')
        {
            axios.get('http://localhost:3000/cursos')
            .then(resp => {
                cursos = resp.data
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                })
                res.write('<h2><a href = "/cursos">Escola de Música: Lista de Cursos</a></h2>')
                res.write('<ul>')
                cursos.forEach(c => 
                {
                    res.write('<li><a href = "/cursos/' + c.id + '">' + c.id + ' </a> - ' + c.designacao  + '</li>')
                })
                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar ao Início</a>]</address>')
                res.end()
            })
            .catch(error => {
                console.log("Erro na obtenção da lista de alunos")
            })
        }

        //Lista dos Instrumentos
        else if(req.url == '/instrumentos')
        {
            axios.get('http://localhost:3000/instrumentos')
            .then(resp => {
                instrumentos = resp.data
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                })
                res.write('<h2><a href = "/cursos">Escola de Música: Lista de Instrumentos</a></h2>')
                res.write('<ul>')
                instrumentos.forEach(i => 
                {   
                    res.write('<li><a href="/instrumentos/'+ i.id + '">' + i.id + '</a> - ' +  i['#text'] +  '</li>')
                })
                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar ao Início</a>]</address>')
                res.end()
            })
            .catch(error => {
                console.log("Erro na obtenção da lista de instrumentos!")
            })
        }

        //Aluno
        else if(req.url.match(/\/alunos\/A[0-9]{3,5}/)){
            axios.get('http://localhost:3000' + req.url)
            .then(resp => {
                aluno = resp.data
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                })

                res.write('<h2>' + aluno.nome + ' (' + aluno.id + ')' + '</h2>')
                res.write('<p>Data de Nascimento: ' + aluno.dataNasc + '</p>')
                res.write('<p>Curso: <a href="' + "/cursos/" + aluno.curso + '">' + aluno.curso + '</a></p>')
                res.write('<p>Ano de Curso: ' + aluno.anoCurso + '</p>')
                res.write('<p>Instrumento: ' + aluno.instrumento + '</p>')

                res.write('<address>[<a href="/alunos">Voltar à Lista de Alunos</a>]</address>')
                res.write('<address>[<a href="/">Voltar ao Início</a>]</address>')
                res.end()
            })
            .catch(error => {
                console.log("Aluno pedido não existe")
            })
        }

        //Curso
        else if(req.url.match(/\/cursos\/(CB([1-9]|1[0-9]|2[0-2])||CS(2[3-9]|3[0-9]|4[0-4]))/)){
            axios.get('http://localhost:3000' + req.url)
            .then(resp => {
                curso = resp.data
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                })

                res.write('<h2>' + curso.designacao + '(' + curso.id + ')' + '</h2>')

                res.write('<p>Duracao: ' + curso.duracao + '</p>')
                res.write('<p>Instrumento: <a href="' + "/instrumentos/" + curso.instrumento.id + '">' + curso.instrumento['#text'] + '</a>' + '</p>')

                res.write('<address>[<a href="/cursos">Voltar à Lista de Cursos</a>]</address>')
                res.write('<address>[<a href="/">Voltar ao Início</a>]</address>')
                res.end()
            })
            .catch(error => {
                console.log("Curso pedido não existe")
            })
        }

        //Instrumento
        else if(req.url.match(/\/instrumentos\/I[1-9]|1[0-9]|2[0-2]/)){
            axios.get('http://localhost:3000' + req.url)
            .then(resp => {
                instrumento = resp.data
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                })

                res.write('<h2>' + instrumento['#text'] + '</h2>')

                res.write('<p>ID: ' + instrumento.id + '</p>')

                res.write('<address>[<a href="/instrumentos">Voltar à Lista de Instrumentos</a>]</address>')
                res.write('<address>[<a href="/">Voltar ao Início</a>]</address>')
                res.end()
            })
            .catch(error => {
                console.log("Instrumento pedido não existe")
            })
        }

        //Erros
        else
        {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write("<p>Pedido não suportado (" + req.method + ' ' + req.url + ')</p>')
            res.end()  
        }
    }
    
    else
    {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write("<p>Pedido não suportado (" + req.method + ' ' + req.url + ')</p>')
        res.end()  
    }
}).listen(num_port)

console.log("Servidor à escuta na porta " + num_port)