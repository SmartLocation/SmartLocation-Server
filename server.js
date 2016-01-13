var express = require('express');
var app = express();
var http = require('http').Server(app);

//Socket.io
var io = require('socket.io')(http);

//Redis
var redis = require("redis"),
redisClient = redis.createClient();

/*app.get('/', function(req, res){
    res.sendFile('index.html' , { root : __dirname});
});

app.use(express.static('public'));
*/

//Caso houver um erro com  Redis
redisClient.on("error", function (err) {
    console.log("Error " + err);
});


//Quando o cliente se conecta
io.on('connection', function(socket){
    
    console.log('## New Connection!');
    
    socket.on('connection', function(msg){
        io.emit('connection', "O usuário "+msg+" conectou-se.");
    });

});

http.listen(process.env.PORT, function(){
console.log('listening on *:'+process.env.PORT);
});