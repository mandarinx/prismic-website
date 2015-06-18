var config = require('../config');
var config_json = {
    "construction":     false,
    "cache": {
        "static_files": 7776000
    },
    "url": {
        "pub":         "http://www.example.com",
        "dev":         "http://dev.example.com"
    },
    "dir": {
        "public":       "/public",
        "layout":       "/app/views/layouts",
        "partials":     "/app/views/partials",
        "views":        "/app/views"
    },
    "routes": {
        "home":       "/",
        "works":      "/works",
        "work":       "/work/:slug/:id",
        "workopt":    "/work/:slug/:id?",
        "about":      "/about",
        "contact":    "/contact"
    }
};

config.init(config_json);

module.exports = config;
