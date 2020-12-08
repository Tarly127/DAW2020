var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-templates')

var fs = require('fs')

var jsonfile = require('jsonfile')
var logger = require('morgan')

var multer = require('multer')
const { read, fstat } = require('fs')
var upload = multer({dest: 'uploads/'})

port = 7701

var app = express()

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.use(express.static('public'))

app.use(function(req, res, next){
    next()
})

app.get('/files/upload', function(req, res){
    var d = new Date().toISOString().substr(0.16)
    res.writeHead(200, {'Content-type': 'text/html;charset=utf-8'})
    res.write(templates.fileForm(d))
    res.end()
})

app.get('/files/download/:fname', (req, res) => {
    res.download(__dirname + '/public/fileStore/' + req.params.fname)
})

app.get('*', function(req, res){
    var d = new Date().toISOString().substr(0.16)
    var files= jsonfile.readFileSync('./dbFiles.json')
    res.writeHead(200, {'Content-type': 'text/html;charset=utf-8'})
    res.write(templates.fileList(files, d))
    res.end()
})

app.post('/files', upload.array('myFile', 64), function(req, res){

    var i = 0;

    if(req.files.length > 1)
    {
        req.files.forEach(file => {
            console.log(i)
            let oldPath = __dirname + '/' + file.path
            let newPath = __dirname + '/public/fileStore/' + file.originalname
    
            fs.rename(oldPath, newPath, function(err) { 
                if(err) throw err
            })
    
            var files= jsonfile.readFileSync('./dbFiles.json')
            var d = new Date().toISOString().substr(0.16)
            console.log("I: " + i)
            files.push(
                {
                    date: d,
                    name: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                    desc: req.body.desc[i]
                }
            )
            jsonfile.writeFileSync('./dbFiles.json', files)
            i++
        })
    }

    else{
        let oldPath = __dirname + '/' + req.files[0].path
        let newPath = __dirname + '/public/fileStore/' + req.files[0].originalname

        fs.rename(oldPath, newPath, function(err) { 
            if(err) throw err
        })

        var files= jsonfile.readFileSync('./dbFiles.json')
        var d = new Date().toISOString().substr(0.16)
        files.push(
            {
                date: d,
                name: req.files[0].originalname,
                size: req.files[0].size,
                mimetype: req.files[0].mimetype,
                desc: req.body.desc
            }
        )
    jsonfile.writeFileSync('./dbFiles.json', files)
    }

    
    
    res.redirect('/')
})

app.listen(port, () => {
    console.log('Servidor à escuta na porta ' + port + '...')
})