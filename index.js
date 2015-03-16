var logger      = require('logfmt');
var http        = require('http');
var web         = require('./app/webserver');
var config      = require('./config');
var util        = require('util');
var events      = require('events');

var server;

function Main() {
    events.EventEmitter.call(this);
}

util.inherits(Main, events.EventEmitter);

Main.prototype.init = function(config_json, options) {
    config.init(config_json, options);

    process.on('SIGTERM', onShutdown);

    logger.log({
        type: 'info',
        msg:  'starting server'
    });

    server = http.createServer(web());
    server.listen(config.port, onListen);

    this.emit('ready', web);
};

module.exports = new Main();

function onListen() {
    logger.log({
        type: 'info',
        msg: 'listening',
        port: server.address().port
    });
}

function onShutdown() {
    logger.log({
        type: 'info',
        msg: 'shutting down'
    });
    server.close(function() {
        logger.log({ type: 'info', msg: 'exiting' });
        process.exit();
    });
}
