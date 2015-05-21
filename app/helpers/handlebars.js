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

// Usage:
// {{email hello@company.com "Send us an email" class="button"}}

// If you leave out caption, the email address will be used as caption
// If you leave out email, the email address will be replaced with caption
// class argument is optional
// If you leave out email and caption, both will default to john@doe.com
module.exports.email = function(a_email_address, a_caption, a_options) {
    var attrs = [];
    var email = 'john@doe.com';
    var caption = '';
    var options = {
        hash: {}
    };

    if (typeof a_email_address === 'string') {
        email = a_email_address;
        caption = typeof a_caption === 'string' ? a_caption : email;
        options = typeof a_caption === 'string' ? a_options : a_caption;
    } else {
        caption = email;
        options = a_email_address;
    }

    if (typeof options.hash.class !== 'undefined') {
        attrs.push('class="' +
                   Handlebars.escapeExpression(options.hash.class) +
                   '"');
    }

    return new Handlebars.SafeString('<a href="mailto:'+email+'" '+
                                     attrs.join(" ")+'>'+caption+'</a>');
}

module.exports.ashtml = function(context, options) {
    return new Handlebars.SafeString(context ? context.asHtml() : '');
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
