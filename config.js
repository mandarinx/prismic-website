var path    = require('path');
var chalk   = require('chalk');

var config = {
    init: function(config_json, options) {

        if (undef(config_json)) {
            chalk.yellow('WARNING: config.json is undefined');
        }

        if (not(undef(options))) {
            if (not(undef(options.base))) {
                config.base = options.base;
            }
        }

        if (undef(config.base)) {
            config.base = __dirname;
        }

        if (undef(process.env.API_ENDPOINT)) {
            chalk.yellow('WARNING: Missing API endpoint for Prismic.io');
        } else {
            config.apiEndpoint = process.env.API_ENDPOINT;
        }

        if (undef(process.env.ACCESS_TOKEN)) {
            chalk.yellow('WARNING: Missing ACCESS_TOKEN for Prismic.io');
        } else {
            config.accessToken = process.env.ACCESS_TOKEN;
        }

        if (undef(process.env.CLIENT_ID)) {
            chalk.yellow('WARNING: Missing CLIENT_ID for Prismic.io');
        } else {
            config.clientId = process.env.CLIENT_ID;
        }

        if (undef(process.env.CLIENT_SECRET)) {
            chalk.yellow('WARNING: Missing CLIENT_SECRET for Prismic.io');
        } else {
            config.clientSecret = process.env.CLIENT_SECRET;
        }

        config.cache = {
            static_files: undef(config_json.cache.static_files) ?
                          2592000 :
                          config_json.cache.static_files
        };

        config.cookieSecret = undef(process.env.COOKIE_SECRET) ?
                            'kjdtHUY765&%jh754#0lk' :
                            process.env.COOKIE_SECRET;

        config.port = undef(process.env.PORT) ?
                    5000 :
                    int(process.env.PORT);

        config.verbose = undef(process.env.VERBOSE) ?
                       false :
                       bool(process.env.VERBOSE);

        config.production = process.env.NODE_ENV === 'production';
        config.development = process.env.NODE_ENV === 'development';

        // Set website in Under Construction mode
        config.construction = undef(config_json.construction) ?
                            false :
                            config_json.construction;

        if (undef(config_json.routes)) {
            chalk.yellow('WARNING: Missing routes');
        } else {
            config.routes = config_json.routes;
        }

        config.json = config_json;
    },

    dir: function(directory) {
        return config.base +
               (config.production && config.json.dir.production ?
                    config.json.dir.production :
                    '') +
               config.json.dir[directory];
    },

    url: function() {
        if (not(undef(process.env.LOCAL))) {
            if (bool(process.env.LOCAL)) {
                return 'http://localhost:' + config.port;
            }
        }

        return config.production ?
               config.json.url.pub :
               config.json.url.dev;
    }
}

module.exports = config;

function undef(value) {
    return typeof value === 'undefined';
}

function not(value) {
    return !value;
}

function bool(str) {
    if (str == void 0) return false;
    return str.toLowerCase() === 'true';
}

function int(str) {
    if (!str) return 0;
    return parseInt(str, 10);
}

function float(str) {
    if (!str) return 0;
    return parseFloat(str, 10);
}
