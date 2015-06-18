var logger      = require('logfmt');

var config          = require(__dirname + '/../../config');

module.exports = function(page_name) {
    return function(req, res, next) {
        res.content = {
            page: {
                name:       page_name,
                url:        config.url() + config.routes[page_name],
                base_url:   config.url()
            }
        };

        next();
    }
}
