var fs              = require('fs');
var path            = require('path');
var express         = require('express');
var exphbs          = require('express-handlebars');
var compress        = require('compression');
var favicon         = require('serve-favicon');
var helmet          = require('helmet');
var cookieParser    = require('cookie-parser');

var config          = require('../config');
var router          = require('./router');
var events          = require('./events');
var errors          = require('./errors');
var logs            = require('./logs');
var hbHelpers       = require('./helpers/handlebars');
var utils           = require('./modules/utils');
var templates       = require('./modules/templates');
var bookmarks       = require('./modules/bookmarks');
var query           = require('./modules/query');
var linkresolver    = require('./modules/linkresolver');

var web;
var errs;
var hbs_ext = '.hbs';
var assign = Object.assign || require('object.assign');

module.exports = function(options) {

    hbHelpers.init();
    options = options || {};
    var helpers = typeof options.helpers !== 'undefined' ?
                  assign({}, hbHelpers, options.helpers) :
                  hbHelpers;

    errs = errors(config.verbose);
    web = express();

    var hbs = exphbs.create({
        extname:        hbs_ext,
        defaultLayout:  'main',
        helpers:        helpers,
        layoutsDir:     config.dir('layout'),
        partialsDir:    config.dir('partials')
    });

    if (config.development) {
        web.set('showStackError', true);
    }

    web.engine(hbs_ext,     hbs.engine);
    web.set('view engine',  hbs_ext);
    web.set('views',        config.dir('views'));
    web.set('view cache',   config.production);

    web
        .use(logs(config.verbose))
        .use(compress({
            filter: function (req, res) {
                return /json|text|javascript|css|svg/.test(res.getHeader('Content-Type'));
            },
            level: 9
        }))

        .use(favicon(config.dir('public') + '/favicon.ico'))
        .use(cookieParser({ secret: config.cookieSecret }))
        .use(helmet())
        .use(router())
        .use(errs.notFound)
        .use(errs.log)
        .use(errs.html);

    return web;
};

Object.defineProperty(module.exports, 'events', {
    get: function() { return events; }
});

Object.defineProperty(module.exports, 'utils', {
    get: function() { return utils; }
});

Object.defineProperty(module.exports, 'templates', {
    get: function() { return templates; }
});

Object.defineProperty(module.exports, 'bookmarks', {
    get: function() { return bookmarks; }
});

Object.defineProperty(module.exports, 'query', {
    get: function() { return query; }
});

Object.defineProperty(module.exports, 'linkresolver', {
    get: function() { return linkresolver; }
});
