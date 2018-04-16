var express = require('express');
var router = express.Router();
var Region = require('../models/Region');

/* GET regions listing. */
router.get('/', function (req, res, next)
{
    Region.getAllRegions(function (err, rows)
    {
        if (err)
        {
            res.json(err);
        }
        else
        {
            res.json({ "success": true, "results": rows });
        }
    });
});

module.exports = router;