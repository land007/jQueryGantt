// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');

// create an instance of express to serve our end points
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var httpProxy = require('http-proxy');

//新建一个代理 Proxy Server 对象
var proxy = httpProxy.createProxyServer({});
//捕获异常
proxy.on('error',
	function(err, req, res) {
		res.writeHead(500, {
			'Content-Type' : 'text/plain'
		});
		res.end('Something went wrong. And we are reporting a custom error message.');
	});

// we'll load up node's built in file system helper library here
// (we'll be using this later to serve our JSON files
const fs = require('fs');

// configure our express instance with some body-parser settings 
// including handling JSON data
app.use(express.json({limit: '100mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// this is where we'll handle our various routes from
const routes = require('./routes/routes.js')(app, fs);

io.on('connection', function(socket) {
	  console.log('a user connected');
	  socket.emit('get room');
	  socket.on('subscribe', function(data) {
		  console.log('subscribe ' + data.room);
		  socket.join(data.room);
	  });
	  socket.on('unsubscribe', function(data) {
	      console.log('unsubscribe ' + data.room);
	      socket.leave(data.room);
	  });
	  socket.on('disconnect', function() {
		  console.log('user disconnected');
	  });
	  socket.on('chat message', function(msg) {
//		  //给除了自己以外的客户端广播消息
//		  socket.broadcast.emit("msg",{data:"hello,everyone"}); 
//		  //给所有客户端广播消息
//		  io.sockets.emit("msg",{data:"hello,all"});
//		  //不包括自己
//		  socket.broadcast.to('group1').emit('event_name', data);
//		  //包括自己
//		  io.sockets.in('group1').emit('event_name', data);
//		  //获取所有房间（分组）信息
//		  io.sockets.manager.rooms
//		  //获取此socketid进入的房间信息
//		  io.sockets.manager.roomClients[socket.id]
//		  //获取particular room中的客户端，返回所有在此房间的socket实例
//		  io.sockets.clients('particular room')
		  //给自己所在的rooms发消息
		  for(var room in socket.rooms) {
			  if(room != socket.id) {
//				  io.to(room).emit('chat message', msg);
				  socket.broadcast.to(room).emit('chat message', msg);
			  }
		  }
//		  socket.join('cached');
//		  console.log(JSON.stringify(socket.rooms));
//		  io.emit('chat message', msg);
	  });
	});

// finally, launch our server on port 3001.
//const server = app.listen(3001, () => {
//    console.log('listening on port %s...', server.address().port);
//});

const server = http.listen(3001, function() {
  console.log('listening on port %s...', server.address().port);
});
