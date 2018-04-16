var express = require('express');
var router = express.Router();
var Kpi=require('../models/Kpi');
 
router.get('/:id?',function(req,res,next){
 
    if(req.params.id){
 
      Kpi.getKpiById(req.params.id, function (err, rows) {
 
            if (err) {
              var reply = { "success": false, "err": err }
              res.json(reply);
            } else {
                
              var reply = { "success": true, "results": rows };
              res.json(reply);
            }
        });
    } else {

      Kpi.getAllKpis(function (err, rows) {

        if (err) {
          res.json(err);
        } else {
          res.json({ "success": true, "results": rows });
        }
      });
    }
});

module.exports=router;