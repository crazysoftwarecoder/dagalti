'use strict';

var http = require('http');
var https = require('https');

function Client() {
}

Client.prototype.callURL = function(request) {

    var client = http;

    if (request.protocol === 'https') {
        client = https;
    }

    var port = request.port || (request.protocol === 'http') ? 80 : 443;

    var options = {
        host:   request.host,
        port:   port,
        path:   request.path,
        method: request.method,
        headers: request.headers
    }

    var callback = request.callback;

    var requester = client.request(options, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            callback(response.statusCode, response.statusMessage, response.headers, body);
        });
    });

    requester.on('error', function(e) {
        console.log('There was an error processing this request:' + e);
        callback('500', 'There was an error processing this request:' + e, undefined, '');
    });

    var requestBody = request.body;

    if (options.method === 'POST') {
        requester.write(requestBody);
    }

    requester.end();
}

module.exports = Client;