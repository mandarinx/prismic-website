var Prismic         = require('prismic.io').Prismic;
var config          = require(__dirname + '/../../config');

// Router middleware adds a Prismic context to the res object
module.exports = function(req, res, next) {
    Prismic.Api(config.apiEndpoint, function(err, Api) {
        if (err) {
            console.log('prismic middleware ERROR');
            return res.send(500, 'Error 500: ' + err.message);
        }

        Api.apiCache.clear(function() {});

        var ref = req.query['ref'] || Api.master();
        var ctx = {
            api:        Api,
            ref:        ref,
            maybeRef:   ref == Api.master() ? undefined : ref,

            oauth: function() {
                var token = accessToken;
                return {
                    accessToken:            token,
                    hasPrivilegedAccess:    !!token
                }
            }
        };

        res.locals.ctx = ctx;
        next();

    },
    config.accessToken,
    undefined,  // request handler
    undefined,  // api cache
    0);         // cache TTL in seconds. In prismic.io 1.1.3, this doesn't
                // have any effect at all. Forcing a cache reset to get
                // around the issue. TTL is supposed to cache the master ref
                // for 5 seconds by default, but it doesn't work here.
};
