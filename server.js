var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/chat.js', function(req, res) {
  res.sendfile('chat.js');
});

var nicknames = [];
function nicknameValid(nick) {
  return true;
}
function nicknameInUse(nick) {
  r = false;
  for(var i = 0; i < nicknames.length; i++) {
    if(nicknames[i] == nick) {
      r = true;
    }
  }
  return r;
}

io.on("connection", function(socket) {
  socket.on("RAW", function(data) {
    console.log(data);
    client = {};
    bits = data.split(" ");
    address = socket.handshake.address;
    if(bits[0] == "NICK") {
      if(bits.length !== 2) {
        socket.emit("ERROR", "431 ERR_NONICKNAMEGIVEN :No Nickname Given");
      } else if(!nicknameValid(bits[1])) {
        socket.emit("ERROR", "432 ERR_ERRONUESNICKNAME" + bits[1] + " :Erroneus nickname");
      } else if(nicknameInUse(bits[1])) {
        socket.emit("ERROR", "433 ERR_NICKNAMEINUSE " + bits[1] + " :Nickname is already in use");
      } else {
        client.nickname = "";
        socket.emit("NICKREG", bits[1]);
      }
    } else if(bits[0] == "USER") {
      if(client.registered === true) {
        socket.emit("ERROR", "462 ERR_ALREADYREGISTERED :Unauthorized command (already registered)");
      } else {
        client.registered = true;
        client.ip = address.address;
        client.port = address.port;
        client.host = ipMask(client.ip);
      }
    }
  });
});

http.listen(1337, function() {
  console.log("Listening on port 1337");
});
