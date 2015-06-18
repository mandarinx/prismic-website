var config          = require(__dirname + '/../../config');
var type            = require('./type');

module.exports.ahref = function(url) {
    return type(url).is_string ? '<a href="'+url+'">'+url+'</a>' : url;
}

module.exports.email = function(value) {
    return type(value).is_string ? '<a href="mailto:'+value+'">'+value+'</a>' : value;
}

// Accepts a Prismic document and a url type.
// Uses the route definition to map document fragments to url params, and
// gets the domain name from config to output full urls.
// For route '/project/:slug/:id', the link resolver will output the
// domain name, append 'project' since it isn't a variable, and for each
// param that starts with a :, it will try to get the value from the document.

// TODO: Lacks support for all routes (*)
module.exports.document = function(route_name, doc) {
    var route = config.routes[route_name];

    if (type(route).is_undefined) {
        return null;
    }

    var url = config.routes[route_name].split('/').map(function(param) {

        if (param.charAt(0) === ':') {

            if (param.charAt(param.length - 1) === '?') {
                var optional;

                if (type(doc).is_object) {
                    optional = doc[param.slice(1, param.length - 1)];
                }

                return !type(optional).is_undefined ? optional : null;

            } else {
                var required;

                if (type(doc).is_object) {
                    required = doc[param.slice(1)];
                }

                return !type(required).is_undefined ? required : 'PARAM_ERROR';
            }
        }

        return param;
    });

    // var str = config.url() + url.join('/');
    var str = 'http://www.comte.no' + url.join('/');
    if (str.charAt(str.length - 1) !== '/') {
        str += '/';
    }

    return str;
}
