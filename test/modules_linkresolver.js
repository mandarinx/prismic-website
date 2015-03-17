var assert = require('assert');
var config = require('./config_mock');

var linkresolver = require('../app/modules/linkresolver');

describe('Link resolver', function(){
    var empty;
    var link;
    var ahref;
    var email;
    var arr;
    var doc_full;
    var doc_id;
    var doc_slug;

    before(function() {
        empty = '';
        link = 'http://mandarin.no';
        arr = [1,2,3];
        doc_full = {
            slug: 'tullerusk',
            id: '1234'
        };
        doc_id = {
            id: '1234'
        };
        doc_slug = {
            slug: 'tullerusk'
        };
        ahref = function(value) {
           return '<a href="'+value+'">'+value+'</a>';
        };
        email = function(value) {
            return '<a href="mailto:'+value+'">'+value+'</a>';
        };
    });

    it('should create an a href link', function(){
        assert.equal(linkresolver.ahref(empty), ahref(empty));
        assert.equal(linkresolver.ahref(link), ahref(link));
        assert.equal(linkresolver.ahref(undefined), undefined);
        assert.equal(linkresolver.ahref(null), null);
        assert.equal(linkresolver.ahref(1234), 1234);
        assert.equal(linkresolver.ahref(true), true);
        assert.equal(linkresolver.ahref(arr), arr);
    });

    it('should create a mailto link', function(){
        assert.equal(linkresolver.email(empty), email(empty));
        assert.equal(linkresolver.email(link), email(link));
        assert.equal(linkresolver.email(undefined), undefined);
        assert.equal(linkresolver.email(null), null);
        assert.equal(linkresolver.email(1234), 1234);
        assert.equal(linkresolver.email(true), true);
        assert.equal(linkresolver.email(arr), arr);
    });

    it('should create link to routes without params', function(){
        var url = linkresolver.document('home', doc_full);
        assert.notEqual(url, null);
        assert.equal(url.indexOf('/PARAM_ERROR') === -1, true);

        url = linkresolver.document('home', null);
        assert.notEqual(url, null);
        assert.equal(url.indexOf('/PARAM_ERROR') === -1, true);
    });

    it('should create link to routes with params', function(){
        // work route is /work/:slug/:id
        var url = linkresolver.document('work', doc_full);
        assert.notEqual(url, null);
        assert.equal(url.indexOf('/PARAM_ERROR') === -1, true);

        url = linkresolver.document('work', doc_id);
        assert.notEqual(url, null);
        assert.equal(url.indexOf('/PARAM_ERROR') > -1, true);

        url = linkresolver.document('work', null);
        assert.notEqual(url, null);
        assert.equal(url.indexOf('/PARAM_ERROR') > -1, true);
    });

    it('should create link to routes with optional params', function(){
        // workopt route is /work/:slug/:id?
        url = linkresolver.document('workopt', doc_full);
        assert.notEqual(url, null);
        assert.equal(url.indexOf('/PARAM_ERROR') === -1, true);

        url = linkresolver.document('workopt', doc_id);
        assert.notEqual(url, null);
        assert.equal(url.indexOf('/PARAM_ERROR') > -1, true);

        url = linkresolver.document('workopt', doc_slug);
        assert.notEqual(url, null);
        assert.equal(url.indexOf('/PARAM_ERROR') === -1, true);
    });

    it('should return null on inexisting route name', function(){
        var url = linkresolver.document('inexisting_route_name', doc_full);
        assert.equal(url, null);

        url = linkresolver.document('inexisting_route_name', null);
        assert.equal(url, null);
    });
})
