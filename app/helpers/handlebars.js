var config      = require('../../config');
var Handlebars  = require('handlebars');

module.exports.init = function() {
    // Add a helper for each route. A route for e.g. the about page will
    // get a helper called isAbout. Pass the page property to isXxx to evaluate
    // the page name.
    Object.keys(config.routes).forEach(function(page) {
        module.exports['is' + page.charAt(0).toUpperCase() + page.slice(1)] = isPage(page);
    });
}

module.exports.first = function(context, options) {
    return options.fn(context[0]);
}

module.exports.email = function(context, options) {
    return new Handlebars.SafeString('<a href="mailto:'+context+'">'+context+'</a>');
}

module.exports.ashtml = function(context, options) {
    return new Handlebars.SafeString(context.asHtml());
}

module.exports.astext = function(context, options) {
    return new Handlebars.SafeString(context.asText());
}

module.exports.capitalize = function(options) {
    var str = options.fn(this);
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function isPage(page) {
    return function(context, options) {
        if (context === page) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
}
