var net = require("net");
var sys = require("sys");

var log = {
    info:function(msg) {
        return console.log("[INFO]  " + msg);
    },
    debug:function(msg) {
        return console.log("[DEBUG] " + msg);
    },
    warn:function(msg) {
        return console.log("[WARNING] " + msg);
    }
};

Array.prototype.remove = function(e) {
  for (var i = 0; i < this.length; i++) {
    if (e == this[i]) { return this.splice(i, 1); }
  }
};

function Client(stream) {
  this.name = null;
  this.stream = stream;
};

var clients = [];













var server = net.createServer(function(stream) {
    var client = new Client(stream);
    clients.push(client);

    //stream.setTimeout(0);
    stream.setEncoding("utf8");

    stream.addListener("data", function(data) {
        if (client.name == null) {
            client.name = data.match(/\S+/);
            stream.write("===========\n");
            clients.forEach(function(c) {
                if (c != client) {
                    c.stream.write(client.name + " has joined.\n");
                }
                log.info(client.name + " has joined.\n");
            });
            return null;
        }
        var command = data.match(/^\/(.*)/);
        if (command) {
            if (command[1] == "users") {
                clients.forEach(function(c) {
                    stream.write("- " + c.name + "\n");
                });
            }
            else if (command[1] == "quit") {
                stream.end();
            }
            return;
        }
        clients.forEach(function(c) {
            if (c != client) {
                c.stream.write(client.name + ": " + data);
            }
        });
    });

    stream.addListener("end", function() {
        clients.remove(client);
        clients.forEach(function(c) {
            c.stream.write(client.name + " has left.\n");
            log.info(client.name + " has left.");
        });
        stream.end();
    });
});

server.addListener("connection", function(stream) {
    stream.write("Welcome, enter your username:\n");
    log.info("new user connecting... ");
});




server.listen(7000);
