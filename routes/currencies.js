var express = require('express');
var router = express.Router();
var Currency = require('../models/Currency');

/* GET regions listing. */
router.get('/', function (req, res, next) {
    Currency.getAllCurrencies(function (err, rows) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({ "success": true, "results": rows });
        }
    });
});

module.exports = router;