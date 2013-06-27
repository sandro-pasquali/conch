var http = require("http");
var fs = require("fs");
var url = require("url");

var express	= require('express');
var app 	= express();

app
.use(express.static(__dirname))
.use(express.bodyParser());

var EVENT_COUNT = 0;

app.use("/", function(request, response, next) {

	response.broadcast = function(msg) {
		response.write("id: " + (++EVENT_COUNT) + "\n");
		response.write("data: " + msg + "\n\n");
	}
	
	request.user = function() {
		
	}
	
	next();
});

app.get("/login", function(request, response) {

console.log("HI");

	response.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Access-Control-Allow-Origin": "*"
	});
	
	response.write(":" + Array(2049).join(" ") + "\n"); // 2kB padding for IE
	response.write("retry: 2000\n");

	response.broadcast("LOGIN_OK");
	
	response.on("close", function () {
	  //clearTimeout(timeoutId);
	});
	
	response.end();
});

http.createServer(app).listen(8080);