function showImage(name, mimetype){

    var fileObj = $(`
        <div class="w3-row w3-margin">
            <div class="w3-col s6>
                ${ficheiro}
            </div>
            <div class="w3-col s6 w3-border">
               <p>Filename: ${name}</p>
               <p>Mimetype: ${mimetype}</p>
            </div>
        </div>
    `)



    if(mimetype == 'image/png' || mimetype == 'image/jpeg'){
        var ficheiro = $('<img src="fileStore/' + name + '" width="80%"/>')
    }
    else{
        var ficheiro = $('<p>' + name + ", " + mimetype + '</p>')
    }
    var download = $('<div><a href="/files/download/' + name + '">Download</a></div>')
    $('#display').empty()
    $('#display').append(ficheiro, download)
    $('#display').modal()
}