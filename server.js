var express = require('express');
var app = express();
var http = require('http').Server(app);
var tools = require('./user');

//Socket.io
var io = require('socket.io')(http);

//Redis
var redis = require("redis"),
redisClient = redis.createClient();

app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

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

io.on('connection', function(socket){
    console.log('## New Connection!');
    socket.on('newposition', function(position){
        /*io.emit('chat message', msg);*/
        console.log(position);
    })
});


http.listen(process.env.PORT, function(){
    console.log('listening on *:'+process.env.PORT);
});