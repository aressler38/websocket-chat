var iniparser   = require("iniparser");
var url         = require("url");
var express     = require("express");
var fs          = require("fs");
var HTTP        = require("http");

var config      = iniparser.parseSync("./config.ini");
var configMain  = config.main;
var hostName    = configMain.hostName;
var backlog     = configMain.backlog;
var port        = configMain.port;

var app         = express();
var appServer   = HTTP.createServer(app);
var io          = require("socket.io").listen(appServer);


// SERVER CONFIGURATION
// ====================
app.use(express.favicon(__dirname + "/public/favicon.ico")); 
app.use("/", express.static(__dirname + "/public"));

// RUN
// ===
appServer.listen(port);

// SOCKET.IO CONFIGURATION
// =======================
io.sockets.on("connection", function(socket) {
    socket.on("reply", function(data) {
        console.log(data);
        socket.broadcast.emit("news", data);
    });
});

