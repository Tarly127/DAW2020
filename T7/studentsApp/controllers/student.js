//Student Controller

var student = require('../models/students')

module.exports.list = () => {
    return student
        .find()
        .sort({nome:1})
        .exec()
}

module.exports.lookUp = id => {
    return student
        .findOne({numero: id})
        .exec() 
}

module.exports.insert = std => {
    var newStudent = new student(std)
    return newStudent.save()
}

module.exports.update = (std, id) => {
    return student.findOneAndUpdate({numero:id},{$set: {nome: std.nome, numero: std.numero, git: std.git, tpc: std.tpc}}).exec()
}

module.exports.delete = id => {
    return student.findOneAndDelete({numero:id}).exec()
}