var fs = require('fs');

module.exports = (function singleton() {
    var instance;

    function init() {

        var cacheFilePath = './.cache/.proxyCache';

        return {
            getCache: function() {
                var exists = fs.existsSync(cacheFilePath);
                if (exists) {
                    var json = JSON.parse(fs.readFileSync(cacheFilePath, "utf8"));
                    return json;
                }
                else {
                    return null;
                }
            },
            persistCache: function(cacheJson) {
                var exists = fs.existsSync(cacheFilePath);
                if (!exists) { 
                    if (!fs.existsSync('./.cache')) {
                        fs.mkdirSync('./.cache');
                    }
                }
                var file = fs.openSync(cacheFilePath, 'w');
                var jsonString = JSON.stringify(cacheJson);

                fs.writeSync(file, jsonString);
                fs.closeSync(file);
            },
            getKey: function(method, host, port, pathName, headers, body) {

                function getHeadersForKey(headers) {
                    var headerNames = [];

                    for (header in headers) {
                        if (header === '<dont-cache-this-header>') {
                            continue;
                        }
                        headerNames.push(header + ':' + headers[header]);
                    }

                    headerNames.sort();

                    var headerKeyString = '';

                    for (header in headerNames) {
                        headerKeyString += headerNames[header];
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

                return key;
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

