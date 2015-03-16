var path    = require('path');
var chalk   = require('chalk');

var base;

module.exports.init = function(config_json, options) {

    if (undef(config_json)) {
        chalk.yellow('WARNING: config.json is undefined');
    }

    if (not(undef(options))) {
        if (not(undef(options.base))) {
            base = options.base;
        }
    }

    if (undef(base)) {
        base = __dirname;
    }

    if (undef(process.env.API_ENDPOINT)) {
        chalk.yellow('WARNING: Missing API endpoint for Prismic.io');
    } else {
        this.apiEndpoint = process.env.API_ENDPOINT;
    }

    if (undef(process.env.ACCESS_TOKEN)) {
        chalk.yellow('WARNING: Missing ACCESS_TOKEN for Prismic.io');
    } else {
        this.accessToken = process.env.ACCESS_TOKEN;
    }

    if (undef(process.env.CLIENT_ID)) {
        chalk.yellow('WARNING: Missing CLIENT_ID for Prismic.io');
    } else {
        this.clientId = process.env.CLIENT_ID;
    }

    if (undef(process.env.CLIENT_SECRET)) {
        chalk.yellow('WARNING: Missing CLIENT_SECRET for Prismic.io');
    } else {
        this.clientSecret = process.env.CLIENT_SECRET;
    }

    this.cache = {
        static_files: undef(config_json.cache.static_files) ?
                      2592000 :
                      config_json.cache.static_files
    };

    this.cookieSecret = undef(process.env.COOKIE_SECRET) ?
                        'kjdtHUY765&%jh754#0lk' :
                        process.env.COOKIE_SECRET;

    this.port = undef(process.env.PORT) ?
                5000 :
                int(process.env.PORT);

    this.verbose = undef(process.env.VERBOSE) ?
                   false :
                   bool(process.env.VERBOSE);

    this.production = process.env.NODE_ENV === 'production';
    this.development = process.env.NODE_ENV === 'development';

    // Set website in Under Construction mode
    this.construction = undef(config_json.construction) ?
                        false :
                        config_json.construction;

    if (undef(config_json.routes)) {
        chalk.yellow('WARNING: Missing routes');
    } else {
        this.routes = config_json.routes;
    }

    this.config = config_json;
}

module.exports.dir = function(directory) {
    return base +
           (this.production ? '/production' : '') +
           this.config.dir[directory];
}

module.exports.url = function(type) {
    return this.production ?
           this.config.url[type] :
           'http://localhost:'+this.port;
}

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
