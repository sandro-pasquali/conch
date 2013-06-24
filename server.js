var http = require("http");
var fs = require("fs");
var url = require("url");

var EVENT_COUNT = 0;

http.createServer(function (request, response) {

  var parsedURL = url.parse(request.url, true);
  var pathname = parsedURL.pathname;
  
  var broadcast = function(msg) {
    response.write("id: " + (++EVENT_COUNT) + "\n");
    response.write("data: " + msg + "\n\n");
}
  
  if(pathname.indexOf("/events") === 0) {

    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*"
    });

    response.write(":" + Array(2049).join(" ") + "\n"); // 2kB padding for IE
    response.write("retry: 2000\n");

    var lastEventId = Number(request.headers["last-event-id"]) || Number(parsedURL.query.lastEventId) || 0;

    var msg = "Hello world!";
    
    broadcast(msg);
    
    response.on("close", function () {
      //clearTimeout(timeoutId);
    });
    
    return response.end();

  }

pathname = pathname === "/" ? "./index.html" : "." + pathname;


  fs.exists(pathname, function(exists) {
  	if(!exists) {
  		response.writeHead(404);
  		return response.end();
  	}

  	fs.createReadStream(pathname).pipe(response);
  });

}).listen(8080);