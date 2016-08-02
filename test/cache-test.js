'use strict';

var cache = require('../src/cache');
var assert = require('assert');
var fs = require('fs');

describe('Cache', function() {
    var path = './.temp/';
    var file = '.proxyCache';

    const execSync = require('child_process').execSync;

    describe('getCache', function() {
        it('should return null when there is no path', function() {
            if (fs.existsSync(path)) {
                execSync('rm -rf ' + path);
            }
            assert.equal(null, cache.getInstance().getCache(path));
        });

        it('should return null when the file is empty', function() {
            execSync('mkdir -p ' + path);
            execSync('touch ' + path + file);
            assert.equal(null, cache.getInstance().getCache(path + file));
            execSync('rm -rf ' + path);
        });

        it ('should return json from file when file contains valid JSON', function() {
            execSync('mkdir -p ' + path);
            execSync('touch ' + path + file);
            execSync("exec echo '{\"name\":\"Dagalti\", \"age\":0}' > " + path + file);
            assert.equal('Dagalti', cache.getInstance().getCache(path + file).name);
            assert.equal(0, cache.getInstance().getCache(path + file).age);
        });
    });
});