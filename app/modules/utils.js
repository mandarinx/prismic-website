var config          = require('../../config');

module.exports.getImage = function getImage(img) {
    if (img) {
        return {
            small:     img.views.small.url,
            medium:    img.views.medium.url,
            large:     img.views.large.url,
            main:      img.main.url,
            alt:       img.main.alt
        };
    }
    return null;
}

module.exports.iterateGroup = function iterateGroup(options, cb) {
    options = options || undefined;

    if (!options) {
        console.log("Cannot iterate group without options");
        return;
    }

    if (!options.document) {
        console.log("Group iterator missing document reference");
        return;
    }

    if (!options.path) {
        console.log("Group iterator missing path to group");
        return;
    }

    if (typeof cb !== 'function') {
        console.log('Group iterator callback must be a function');
        return;
    }

    var group = options.document.getGroup(options.path);
    var docs = group ? group.toArray() : [];
    return docs.map(function(item, i) {
        return cb(item, i);
    });
    group = null;
    docs = null;
    return [];
}
