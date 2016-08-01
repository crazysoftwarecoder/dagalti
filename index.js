'use strict';

var http = require('http');
var URL = require('url-parse');

var logger = require('./src/request-logger');
var Client = require('./src/http-client');
var cache  = require('./src/cache');

const PORT = process.argv[2] || 32876;

var cacheJSON = cache.getInstance().getCache() || {};

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

  var host = url.hostname;
  var port = url.port || 80;
  var pathName = url.pathname;

  var client = new Client();

  var httpRequest = {
    host: host,
    port: port,
    path: pathName,
    method: request.method,
    callback: function(status, statusMessage, headers, body) {
      response.writeHead(status, headers);
      response.write(body);
      response.end();
    }
  }

  var body;
  request.on('data', function(chunk) {
    if (!body) {
      body = [];
    }
    body.push(chunk);
  }).on('end', function() {
    if (body) {
      body = Buffer.concat(body).toString();
      httpRequest.body = body;
    }
    client.callURL(httpRequest);
  });
});

httpServer.listen(PORT);

console.log('Dagalti is running on port ' + PORT + '!');