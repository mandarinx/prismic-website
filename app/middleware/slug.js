var valids = {
    'æ':'',
    'ø':'',
    'å':'a',
    'á':'a',
    'à':'a',
    'ä':'a',
    'â':'a',
    'ã':'a',
    'é':'e',
    'è':'e',
    'ë':'e',
    'ê':'e',
    'í':'i',
    'ì':'i',
    'ï':'i',
    'î':'i',
    'ó':'o',
    'ò':'o',
    'ö':'o',
    'ô':'o',
    'õ':'o',
    'ú':'u',
    'ù':'u',
    'ü':'u',
    'û':'u',
    'ÿ':'y',
    'ñ':'n',
    'ç':'c'
};

module.exports = function clean(req, res, next) {
    if (typeof req.params.slug !== 'undefined') {
        req.params.slug = req.params.slug.toLowerCase().split('').map(function(ch) {
            return valids[ch] ? valids[ch] : ch;
        }).join('');
    }

    next();
}
