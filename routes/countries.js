var express = require('express');
var router = express.Router();
var Country = require('../models/Country');

/* GET regions listing. */
router.get('/', function (req, res, next) {
    Country.getAllCountries(function (err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({ "success": true, "results": rows });
        }
    });
});

router.get('/:regionid?', function (req, res, next) {

    Country.getCountriesByRegionId(req.params.regionid, function (err, rows) {
        if (err) {
            res.json({ "success": false, "err": err });
        }
        else {
            res.json({ "success": true, "results": rows });
        }
    });
});

module.exports = router;