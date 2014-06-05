var socket = io();

function getTime() {
  d = new Date();
  h = d.getHours();
  m = d.getMinutes();
  if(h < 10) {
    h = "0" + h;
  }
  if(m < 10) {
    m = "0" + m;
  }
  s = h+":"+m;
  return s;
}

$("form").submit(function() {
  data = $("#m").val();
  bits = data.split(" ");
  if(bits[0] == "/clear") {
    $("#messages").html("");
  } else {
    socket.emit("data", data);
  }
  $("#m").val("");
  return false;
});

socket.on("connect", function(data) {
  socket.emit("RAW", "NICK " + prompt("Please choose a nickname."));
});
socket.on("NICKREG", function(nick) {
  socket.emit("RAW", "USER " + nick + " 0 * :NodeIRC User");
});
socket.on("ERROR", function(data) {
  $("#messages").append( $(div).html( data ) );
});
