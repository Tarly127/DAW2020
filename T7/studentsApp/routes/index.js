var express = require('express');
var router = express.Router();
var student= require('../controllers/student')

function convertTPC(data){
  var tpcs = data.tpc.split(',')
  var ret = []

  ret[0] = Number(tpcs[0][1])
  for(let i = 1; i < 7; i++){
    ret[i] = Number(tpcs[i])
  }
  ret[7] = Number(tpcs[7][0])

  return ret
}

function prepData(data){
  var tpc = []
  if(data.tp0) tpc[0] = 1;
  else tpc[0] = 0;
  if(data.tp1) tpc[1] = 1;
  else tpc[1] = 0;
  if(data.tp2) tpc[2] = 1;
  else tpc[2] = 0;
  if(data.tp3) tpc[3] = 1;
  else tpc[3] = 0;
  if(data.tp4) tpc[4] = 1;
  else tpc[4] = 0;
  if(data.tp5) tpc[5] = 1;
  else tpc[5] = 0;
  if(data.tp6) tpc[6] = 1;
  else tpc[6] = 0;
  if(data.tp7) tpc[7] = 1;
  else tpc[7] = 0;
  
  data.tpc = tpc
  return data
}



/* UPDATE a student */
router.post('/students/update/:id', function(req, res) {
  var id = req.url.split('/')[3]
  var data = prepData(req.body)

  console.log(id)
  console.log(data)

  student.update(data, id)
  .then(data => {
    res.render('confirm_edit', {})})
  .catch(err => {
    res.render('error', {error:err})
  })
})

/* POST new student */
router.post('/students', function(req, res) {
  var data = req.body

  /*Tratar dos TPCs*/
  data.tpc = convertTPC(data)

  student.insert(data)
  .then(() => {
    res.render('confirm',{})
  })
  .catch(err => {
    res.render('error', {error: err})
  })
})

/* DELETE a student */
router.get('/students/delete/:id', function(req, res) {
  var id = req.url.split('/')[3]
  student.delete(id)
  .then(data => {
    res.render('confirm_delete', {})})
  .catch(err => {
    res.render('error', {error:err})
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Edit a student */
router.get('/students/editar/:id', function(req, res){
  var id = req.url.split('/')[3]
  student.lookUp(id)
  .then(data => {
    res.render('edit', { std: data })
  })
  .catch(err => {
    res.render('error', {error: err})
  })
})

/* Register a student */
router.get('/students/registar', function(req, res){
  res.render('register')
})

/* GET a student */
router.get('/students/:id', function(req, res) {
  var id = req.url.split('/')[2]
  student.lookUp(id)
  .then(data => {
    res.render('student', { std: data })
  })
  .catch(err => {
    res.render('error', {error: err})
  })
})

/* GET list of students */
router.get('/students', function(req, res) {
  student.list()
  .then(data => {
    res.render('students', { list: data });
  })
  .catch(err => {
    res.render('error', {error: err})
  })
});

module.exports = router;
