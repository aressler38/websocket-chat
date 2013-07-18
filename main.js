var iniparser   = require("iniparser");
//var http        = require("http");
//var fs          = require("fs");
//var path        = require("path");
var url         = require("url");

var config = iniparser.parseSync("./config.ini");
var configMain = config.main;
var hostName = configMain.hostName;
var backlog = configMain.backlog;
var port = configMain.port;

var mimeTypes = {
    "html"  : "text/html",
    "jpeg"  : "image/jpeg",
    "jpg"   : "image/jpeg",
    "png"   : "image/png",
    "js"    : "text/javascript",
    "css"   : "text/css",
    "ico"   : "image/x-icon",
    "generic":"application/octet-stream"
};


/*
var server = http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname;
    if (uri == '/') {
        uri = "/index.html";
    }
    var filename = path.join(process.cwd(), uri);
    path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
            return null;
        }
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        if (typeof(mimeType) == "undefined") {
            mimeType = mimeTypes["generic"];
        }

        response.writeHead(200, mimeType);

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(response);

    }); //end path.exists
});

server.listen(port, hostName, backlog, function(err){
    if(err) {
        console.log("ERROR FOUND");
        return console.log(err);
    }
    else {
        console.log("initialized server for "+hostName+" on port "+port+'.');
    }
});

*/



var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

    
 
app.listen(port);
console.log("listening on port "+port);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html', function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}


/*
io.configure('development', function(){
  io.set('transports', ['xhr-polling']);
});
*/

io.sockets.on('connection', function(socket) {
    console.log("new connection");
    //socket.emit('news', { text: 'starting up \n text now.' });
    socket.on('reply', function(data) {
        socket.broadcast.emit("news", data);
        console.log(data);
    });
});


