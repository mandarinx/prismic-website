var express         = require('express');
var path            = require('path');
var serveStatic     = require('serve-static');

var config          = require('../config');
var prismic         = require('./middleware/prismic');
var construction    = require('./middleware/construction');
var slug            = require('./middleware/slug');
var defaultcontent  = require('./middleware/defaultcontent');
var events          = require('./events');

module.exports = function() {
    var router = express.Router();

    Object.keys(config.routes).forEach(function(page_name) {
        router.get(config.routes[page_name],
                    prismic,
                    slug,
                    defaultcontent(page_name),
                    construction,
                    routeHandler(page_name));
    });

    router
        .use('/public', express.static(config.dir('public'), {
            maxAge: config.cache.static_files
        }));

    return router;
};

function routeHandler(page_name) {
    return function handler(req, res, next) {
        events.emit(page_name, req, res, next);
    };
}
