var http = require('http')
var aux = require('./mymod')
var fs = require('fs')

const num_port = 12345


http.createServer(function (req, res) {
    console.log(req.method + " " + req.url + " " + aux.myDateTime())

    if(req.url.match("\/arqs(\/)?$"))
    {
        fs.readFile("my_site/index.html", function (err, data) {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
            res.write(data)
            res.end()
        })
    }
    else
    {
        if(req.url.match(/\/arqs\/((12[0-2])|(1[0-1][0-9])|([1-9][0-9])|[1-9])$/))
        {
            var fd = req.url.split("/")[2]
            fs.readFile("my_site/arq" + fd + '.html', function (err, data) {
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                res.write(data)
                res.end()
            })
        }
        else
        {
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
            res.write("<p>O URL não corresponde ao esperado.</p>")
            res.end()
        }
    }
}).listen(num_port)

console.log("Servidor ligado na porta: " + num_port)
