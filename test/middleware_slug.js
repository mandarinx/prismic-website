var assert = require('assert');
var slug = require('../app/middleware/slug');

describe('Slug middleware', function(){
    var req;
    var slug_string;

    before(function() {
        slug_string = 'AOIU--khad1233siÆØÅÆØÅØæøåøöëï';
        req = {
            params: {
                slug: slug_string
            }
        };
    });

    it('should return a lower cased string without special characters', function(){
        slug(req, null, function() {
            assert.equal(req.params.slug.length, slug_string.length);
            assert.notEqual(req.params.slug, slug_string);
        });
    })
})
