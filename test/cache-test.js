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

    describe('getKey', function() {
        it('should return undefined when input is invalid', function() {
            assert.equal(undefined, cache.getInstance().getKey('','localhost',8080,'/'));
        });

        it ('should return a valid key for a GET request', function() {
            assert.equal('GET,localhost,8080,/,header1:value1,', cache.getInstance().getKey('GET','localhost',8080,'/',{'header1':'value1'}));
        });

        it ('should return a valid key for a POST request', function() {
            assert.equal('POST,localhost,8080,/,header1:value1,bodywithnowhitespace', cache.getInstance().getKey('POST','localhost',8080,'/',{'header1':'value1'},'body with no whitespace'));
        });

        it ('should return sorted headers in the key', function() {
            assert.equal('POST,localhost,8080,/,a:value1,b:value2,', cache.getInstance().getKey('POST','localhost',8080,'/',{'b':'value2','a':'value1'}));
        });
    });

    describe('persistCache', function() {
        it('should persist the json that was supplied', function() {
            if (fs.existsSync(path)) {
                execSync('rm -rf ' + path);
            }
            execSync('mkdir -p ' + path);
            cache.getInstance().persistCache({'name':'Dagalti','hotness':'ultra Cool'}, path + file);
            var jsonFromCache = cache.getInstance().getCache(path + file);
            assert.equal('Dagalti', jsonFromCache.name);
            assert.equal('ultra Cool', jsonFromCache.hotness);
        });
    })
});