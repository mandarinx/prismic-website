var config          = require('../../config');
var events          = require('./../events');

// TODO: Put in config.json?
var threeHours = 60 * 60 * 3 * 1000;

module.exports = function(req, res, next) {

    if (!config.construction) {
        next();
        return;
    }

    // Check query param
    if (req.query.bypass === 'true') {
        res.cookie('in_dev', true, {
            maxAge: threeHours,
            httpOnly: true
        });
        next();
        return;
    }

    // Bypass due to cookie
    if (req.cookies.in_dev === 'true') {
        next();
        return;
    }

    events.emit('construction', req, res, next);
};
