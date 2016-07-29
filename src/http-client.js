var http = require('http');

function HttpClient(host, port) {
    this.host = host;
    this.port = port;
}

HttpClient.prototype.get = function(requestHeaders, path, callback) {
    http.get({
        host: this.host,
        port: this.port || 80,
        path: path,
        headers: requestHeaders
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            callback(response.statusCode, response.statusMessage, response.headers, body);
        });
    });
}

module.exports = HttpClient;