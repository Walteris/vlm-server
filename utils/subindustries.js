var express = require('express');
var router = express.Router();
var SubIndustry = require('../models/SubIndustry');

/* GET regions listing. */
router.get('/', function (req, res, next) {
    SubIndustry.getAllSubIndustries(function (err, rows)
    {
        if (err)
        {
            res.json({ "success": true, "results": err });
        }
        else
        {
            res.json({ "success": true, "results": rows });
        }
    });
});

router.get('/:parentid?', function (req, res, next) {

    SubIndustry.getSubIndustriesByParentId(req.params.parentid, function (err, rows)
    {
        if (err)
        {
            res.json({ "success": false, "err": err });
        }
        else
        {
            res.json({ "success": true, "results": rows });
        }
    });
});

module.exports = router;

