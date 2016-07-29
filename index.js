'use strict';

var http = require('http');
var URL = require('url-parse');

var logger = require('./src/request-logger');
var HttpClient = require('./src/http-client');

const PORT = 32876;

var httpServer = http.createServer(function(request, response) {
  request.on('error', function(err) {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', function(err) {
    console.error(err);
  });

  var requestLogger = new logger(request);
  requestLogger.logRequest();

  var url = new URL(request.url);

  var host = url.host;
  var port = url.port || 80;
  var pathName = url.pathname;

  var httpClient = new HttpClient(host, port);

  httpClient.get({}, pathName, function(status, statusMessage, headers, body) {
      response.writeHead(status, headers);
      response.write(body);
      response.end();
  });

});

httpServer.listen(PORT);

console.log('Dagalti is running on port ' + PORT + '!');