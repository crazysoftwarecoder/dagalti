'use strict';

var fs = require('fs');
var config = require('./config');

module.exports = (function singleton() {
    
    var instance;

    function init() {

        return {
            getCache: function(filePath) {
                var exists = fs.existsSync(filePath);

                var cacheJSON;

                if (exists) {
                    var fileStr = fs.readFileSync(filePath, "utf8");
                    if (fileStr) {
                        cacheJSON = JSON.parse(fileStr);
                    }
                    else {
                        cacheJSON = null;
                    }
                }
                else {
                    cacheJSON = null;
                }

                return cacheJSON;
            },
            persistCache: function(cacheJson, filePath) {
                var exists = fs.existsSync(filePath);
                if (!exists) { 
                    if (!fs.existsSync('./.cache')) {
                        fs.mkdirSync('./.cache');
                    }
                }
                var file = fs.openSync(filePath, 'w');
                var jsonString = JSON.stringify(cacheJson);

                fs.writeSync(file, jsonString);
                fs.closeSync(file);
            },
            getKey: function(method, host, port, pathName, headers, body) {

                function getHeadersForKey(headers) {
                    var headerNames = [];

                    for (var header in headers) {
                        if (config.ignoreHeaders.indexOf(header) != -1) {
                            continue;
                        }
                        headerNames.push(header + ':' + headers[header]);
                    }

                    headerNames.sort();

                    var headerKeyString = '';

                    for (var header in headerNames) {
                        headerKeyString += headerNames[header];
                        headerKeyString += ',';
                    }

                    return headerKeyString;
                }

                if (method && host && port && pathName && headers) {
                    var key = '';
                    key += method;
                    key += ',';
                    key += host;
                    key += ',';
                    key += port;
                    key += ',';
                    key += pathName;
                    key += ',';
                    key += getHeadersForKey(headers);
                    if (body) {
                        key += ',';
                        key += body.replace(" ", "");
                    }

                    return key;
                }
                else {
                    return undefined;
                }
            }
        }
    }

    return {
        getInstance:    function() {
            if (!instance) {
                instance = init();
            }

            return instance;
        }
    }
})();

