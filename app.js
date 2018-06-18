var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);

server.listen(3000, function() {
    console.log("Node listen on port 3000");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

app.use(express.static(__dirname));
app.use(express.static('node_modules'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/view-stream.html');
 // res.sendFile('index.html', { root: __dirname });
});
