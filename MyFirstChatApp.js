var http = require('http');
var io = require('socket.io');

function ServerMain(req, res)
{
	res.writeHead(200, {'Content-Type': 'text/html'});

	var pageData = '';

	pageData += '\
		<html><head> \
		<script src="/socket.io/socket.io.js"></script> \
		</head><body> \
		<script> \
			var socket = io.connect("/"); \
\
			function sendMsg() \
			{ \
				document.getElementById("chatZone").value += document.getElementById("nick").value+": "+document.getElementById("chatMsg").value+"\\n"; \
				socket.emit("chatMsg", \
					{ \
						nick: document.getElementById("nick").value, \
						chatMsg: document.getElementById("chatMsg").value \
					} \
				); \
				document.getElementById("chatMsg").value = ""; \
			} \
			function recvMsg(data) \
			{ \
				document.getElementById("chatZone").value += data.nick+": "+data.chatMsg+"\\n"; \
			} \
\
			socket.on("chatMsg", recvMsg); \
		</script> \
		<textarea rows=25 cols=80 id="chatZone"></textarea><br> \
		<input type="text" id="nick" value="A User"></input> \
		<input type="text" length=60 id="chatMsg" value="default message"></input> \
		<input type="button" onClick="sendMsg();" value="Send Message"></input> \
		</body></html>\
	';

	res.end(pageData);
}

function NewClient(client)
{
	function ClientDisconnect(data)
	{
		console.log('Client Disconnected');
	}

	function ChatMessage(data)
	{
		console.log('Recieved Message \''+data.chatMsg+'\' from USER \''+data.nick+'\'');
		client.broadcast.emit('chatMsg', {nick: data.nick, chatMsg: data.chatMsg} );
	}

	client.on('disconnect', ClientDisconnect);
	client.on('chatMsg', ChatMessage);
}

server = http.createServer(ServerMain);
server.listen('8800');

var socket = io.listen(server);
socket.on('connection', NewClient);
