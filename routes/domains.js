var express = require('express');
var router = express.Router();
var Domain=require('../models/Domain');
 
router.get('/:id?',function(req,res,next){
 
    if(req.params.id){
 
      Domain.getDomainById(req.params.id, function (err, rows) {
 
            if (err) {
              var reply = { "success": false, "err": err }
              res.json(reply);
            } else {
                
              var reply = { "success": true, "results": rows };
              res.json(reply);
            }
        });
    } else {

      Domain.getAllDomains(function (err, rows) {

        if (err) {
          res.json(err);
        } else {
          res.json({ "success": true, "results": rows });
        }
      });
    }
});

module.exports=router;