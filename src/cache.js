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

