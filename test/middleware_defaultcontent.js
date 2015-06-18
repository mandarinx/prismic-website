var assert = require('assert');
var config = require('./config_mock');

var defaultcontent = require('../app/middleware/defaultcontent');

describe('Default content middleware', function(){
    var res;
    var page_name;

    before(function() {
        res = {};
        page_name = 'home';
    });

    it('should add a content object to res', function(){
        var defcon = defaultcontent(page_name);

        defcon(null, res, function() {
            assert.equal(res.content.page.name, page_name);
            assert.equal(res.content.page.url, (config.url() + config.routes[page_name]));
        });
    })
})
