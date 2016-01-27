var express = require('express');
var app = express();
var http = require('http').Server(app);
var tools = require('./user');
var mysql = require("mysql");
var async = require("async");

var con = mysql.createConnection({
  host: '0.0.0.0',
  user: 'evandrozanatta',
  database: 'smartlocation'
});

var start = new Date().getTime()

con.connect();

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
    
    /*socket.on('connection', function(msg){
        io.emit('connection', "O usuário "+msg+" conectou-se.");
    });*/
    
    socket.on('user_update', function(msg){
        
        con.query('SELECT COUNT(id) FROM users WHERE id = '+msg[0]+';', function(err, result, callback) {
            console.log("Resultados no banco: "+result[0]['COUNT(id)']);
            if(result[0]['COUNT(id)'] == 0){
                insertUser();
            }
        });
        
        function insertUser(){
            con.query('INSERT INTO users (id, name, login) VALUES ('+msg[0]+', ?, ?);', [msg[1], msg[2]], function(err, result){
                returnOK();
            });
        }
        
        function returnOK(){
            io.emit('user_signup', "O usuário "+msg[1]+" conectou-se.");
        }
    });

});

var stop = new Date().getTime();
var total = (stop - start)/ 1000.0;
console.log('Time = '+total);

http.listen(process.env.PORT, function(){
    console.log('listening on *:'+process.env.PORT);
});