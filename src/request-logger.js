'use strict';

function RequestLogger(request) {
    this.request = request;
}

RequestLogger.prototype.logRequest = function() {
    var request = this.request;

    var body = [];
    request.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();

        console.log('Received Request');
        console.log('----------------');
        console.log('REQUEST URL:= ' + request.method + ' ' + request.url);
        console.log('');
        console.log('REQUEST HEADERS');
        console.log('===============');
        for (var key in request.headers) {
            console.log(key + ':' + request.headers[key]);
        }
        console.log();
        console.log('REQUEST BODY');
        console.log('============');
        console.log(body);
    });
}

module.exports = RequestLogger;