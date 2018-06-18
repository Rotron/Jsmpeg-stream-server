var fs = require('fs'),
	http = require('http'),
	WebSocket = require('ws');

if (process.argv.length < 3) {
	console.log(
		'Usage: \n' +
		'node websocket-relay.js [<stream-port> <websocket-port>]'
	);
	process.exit();
}

var STREAM_PORT = process.argv[2] || 8081,
	WEBSOCKET_PORT = process.argv[3] || 8082

// Websocket Server
var socketServer = new WebSocket.Server({port: WEBSOCKET_PORT, perMessageDeflate: false});
var clientUpgradeUrl

socketServer.connectionCount = 0;
socketServer.on('connection', function(socket, upgradeReq) {
	socketServer.connectionCount++;
	console.log(
		'New WebSocket Connection: ', 
		(upgradeReq || socket.upgradeReq).socket.remoteAddress,
		(upgradeReq || socket.upgradeReq).headers['user-agent'],
		'('+socketServer.connectionCount+' total)'
	);

  socket.send(JSON.stringify({ eventName: "allstreamClient", eventMsg: totalStreamArr }))

	clientUpgradeUrl = upgradeReq.url

	socket.on('close', function(code, message){
		socketServer.connectionCount--;
		console.log(
			'Disconnected WebSocket ('+socketServer.connectionCount+' total)'
		);
	});
});


// Stream Array to store streams
var totalStreamArr = []

// HTTP Server to accept incomming MPEG-TS Stream from ffmpeg
var streamServer = http.createServer( function(request, response) {
	var params     = request.url.split('/'),
			appName    = params[1],
			streamName = params[2]

	response.connection.setTimeout(0);
	console.log(
		'Stream Connected: ' + 
		request.socket.remoteAddress + ':' +
		request.socket.remotePort +
    'Stream Url' + request.url
	);
	
console.log(appName, streamName)


function getAppIndex(appName) {
  var appIndex = totalStreamArr.map(app => { return app.appName }).indexOf(appName)
	return appIndex
}

function getStreamIndex(streamName) {
  var streamIndex = totalStreamArr.map(stream => { return stream.streamName }).indexOf(streamName)
	return streamIndex
}

function streamExist(appIndex, streamIndex) {
	if (appIndex == streamIndex && appIndex !== -1) {
	  return true
	} else {
		return false
	}
}

var appIndex = getAppIndex(appName)
var streamIndex = getStreamIndex(streamName)


if (streamExist(appIndex, streamIndex)) {

		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + ':' +
			request.socket.remotePort + ' - replicate stream.'
		);
		response.end();

} else {

  totalStreamArr.push({
					srcAddr: request.socket.remoteAddress,  
					streamUrl: request.url,
					appName: appName,
					streamName: streamName 
	})

}


  // At stream incoming, send all stream status to client
  socketServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
    	client.send(JSON.stringify({ eventName: "allstreamClient", eventMsg: totalStreamArr }))
  		console.log(totalStreamArr)
    }
  });

	request.on('data', function(data){
	  socketServer.clients.forEach(function each(client) {
		  if (request.url === clientUpgradeUrl) {
	    	if (client.readyState === WebSocket.OPEN) {
	    		client.send(data);
	    	}
		  }
	  });
	});
	request.on('end',function(){
		console.log('close');

		// Remove our stream
    //const appIndex = getAppIndex(appName)
    const streamIndex = getStreamIndex(streamName)
    //totalStreamArr[appIndex].streams = totalStreamArr[appIndex].streams.filter(stream => stream.streamName !== streamName)
    totalStreamArr.splice(streamIndex, 1)

		// If it is the last stream in the app, splice the app from totalStreamArr
		//if (totalStreamArr[appIndex].streams.length == 0) {
    //  totalStreamArr.splice(appIndex,1)
		//}

  // At stream end, send all stream status to client
  socketServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
    	client.send(JSON.stringify({ eventName: "allstreamClient", eventMsg: totalStreamArr }))
  		console.log(totalStreamArr)
    }
  });

	});

}).listen(STREAM_PORT);

console.log('Listening for incomming MPEG-TS Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');
