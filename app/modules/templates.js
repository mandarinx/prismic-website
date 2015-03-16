
module.exports.render = function(res, layout, template) {
    var options = {
        layout: layout
    };

    Object.keys(res.content).forEach(function(key) {
        if (key === 'layout') {
            logger.log({
                type:   'error',
                msg:    'Render: Content object cannot contain a '+
                        'property called layout'
            });
        }
        options[key] = res.content[key];
    });

    res.render(template, options);
}
