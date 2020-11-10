exports.myDateTime = function () {
    var d = new Date()
    return d.toISOString().substring(0,16)
}

exports.turma = "DAW2020"

exports.myProf = function () {
    return "JCR"
}