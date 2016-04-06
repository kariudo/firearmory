var express = require('express');
var router = express.Router();

/* GET partials. */
router.get('/:name', function (req, res, _next) {
    var name = req.params.name;
    res.render('partials/' + name);
});

module.exports = router;
