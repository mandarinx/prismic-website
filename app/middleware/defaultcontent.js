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

        console.log('defaultcontent page.url', res.content.page.url);
        logger.log({
            type: 'info',
            msg:  'defaultcontent page.url' + res.content.page.url
        });

        console.log('defaultcontent page.base_url', res.content.page.base_url);
        logger.log({
            type: 'info',
            msg:  'defaultcontent page.base_url' + res.content.page.base_url
        });

        next();
    }
}
