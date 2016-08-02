'use strict';

var http = require('http');
var URL = require('url-parse');

var logger = require('./src/request-logger');
var Client = require('./src/http-client');
var cache  = require('./src/cache');

var exitHook = require('exit-hook');

const PORT = process.argv[2] || 32878;

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
  var method = request.method;
  var client = new Client();
  var headers = request.headers;

  var cacheKey = cache.getInstance().getKey(method, host, port, pathName, headers, body);
  var value = cacheJSON[cacheKey];

  var httpRequest = {
    host: host,
    port: port,
    path: pathName,
    method: method,
    headers: headers,
    callback: function(status, statusMessage, headers, body) {
      if (!value) {
        cacheJSON[cacheKey] = {
          status: status,
          statusMessage: statusMessage,
          headers: headers,
          body: body
        }
      }
      else {
        console.log('Serving cached response for ' + request.url);
      }
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

    if (value) {
      httpRequest.callback(value.status, value.statusMessage, value.headers, value.body);
    }
    else {
      client.callURL(httpRequest);
    }
  });
});

httpServer.listen(PORT);

// Persist cache when node.js is shut down.
exitHook(function() {
  console.log();
  console.log('Dagalti is shutting down! Persisting cache.');
  cache.getInstance().persistCache(cacheJSON);
});

console.log('Dagalti is running on port ' + PORT + '!');
