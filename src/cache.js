var fs = require('fs');

var cacheSingleton = (function singleton() {
    var instance;

    function init() {

        return {
            getCache: function() {
                var exists = fs.existsSync(cacheFilePath);
                if (exists) {
                    var json = JSON.parse(fs.accessSync(cacheFilePath, fs.constants.R_OK));
                    return json;
                }
                else {
                    return null;
                }
            },
            persistCache: function(cacheJson) {
                var exists = fs.existsSync('./.cache/.proxyCache');
                if (!exists) { 
                    if (fs.existsSync('./.cache')) {
                        fs.mkdirSync('./.cache');
                    }
                }
                var file = fs.openSync('./.cache/.proxyCache', 'w');
                var jsonString = JSON.stringify(cacheJson);

                fs.writeFileSync(file, jsonString);
                fs.closeSync(file);
            },
            getKey: function(method, host, port, pathName, headers, body) {

                function getHeadersForKey(headers) {
                    var headerNames = [];

                    for (header in headers) {
                        headerNames.push(header + ':' + headers[header]);
                    }

                    headerNames.sort();

                    var headerKeyString = '';

                    for (header in headerNames) {
                        headerKeyString += header;
                        headerKeyString += ',';
                    }

                    return headerKeyString;
                }

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

