![alt tag](https://raw.githubusercontent.com/crazysoftwarecoder/dagalti/master/images/Dagalti.png)

**Dagalti** is a dynamic proxy server that caches service responses. It is mainly used to reduce server startup time dramatically for developers who work on **codebases** that take too long to start locally due to the common problem of corporate headquarters <-> datacenter latency.

### Version
0.0.1

### Tech

Dagalti runs on node.js and uses the below projects to run properly

* [exit-hook] - Surefire way of specifying exit hooks for node processes.
* [url-parse] - A simple to use url parser and tokenizer.

And of course Dagalti itself is open source with a [public repository]
 on GitHub.

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

Please follow the below steps to install Dagalti:

```sh
$ git clone git@github.com:crazysoftwarecoder/dagalti.git
$ cd dagalti
$ npm install
$ node index.js
Dagalti is running on port 32876!
```

Once Dagalti is installed it is time to redirect your http and https requests in your working project to the Dagalti process. This is fairly straight-forward for many platforms. 

For ex. in Java to redirect all http(s)requests through a proxy, please follow [this link]. To redirect to Dagalti, you would set the proxy host and port to 127.0.0.1 and 32876 respectively.

### Development

Want to contribute? Great!

Please submit a PR to the master branch. It will be approved asap.

### Todos

 - Tests, Coverage and Grunt
 - Pretty Print Console trivia

License
----

MIT


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [exit-hook]: <https://www.npmjs.com/package/exit-hook>
   [public repository]: <https://github.com/crazysoftwarecoder/dagalti>
   [url-parse]: <https://www.npmjs.com/package/url-parse>
   [this link]: <http://stackoverflow.com/questions/120797/how-do-i-set-the-proxy-to-be-used-by-the-jvm>

