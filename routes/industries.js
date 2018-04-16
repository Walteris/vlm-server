var express = require('express');
var router = express.Router();
var Industry = require('../models/Industry');

/* GET regions listing. */
router.get('/', function (req, res, next) {
    Industry.getAllIndustries(function (err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({ "success": true, "results": rows });
        }
    });
});

module.exports = router;
