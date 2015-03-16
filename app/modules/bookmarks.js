var Promise         = require('promise');
var query           = require('./query');

module.exports.get = function getBookmarks(ctx) {
    var bookmarks = ctx.api.data.bookmarks;
    var lookup = {};
    Object.keys(bookmarks).map(function(name) {
        lookup[bookmarks[name]] = name;
    });

    return new Promise(function (resolve, reject) {
        query(ctx, {
            id: Object.keys(bookmarks).map(function(name) {
                return bookmarks[name];
            })
        })
        .then(function(articles) {
            var documents = {};
            articles.results.forEach(function(article) {
                documents[lookup[article.id]] = article;
            });
            resolve(documents);

        }, function(err) {
            console.log('error: '+err);
            reject(err);
        });
    });
}
