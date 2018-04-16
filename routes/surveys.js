var express = require('express');
var router = express.Router();
var Survey=require('../models/Survey');
 
router.get('/:id?',function(req,res,next){
 
    if(req.params.id){
 
        Survey.getSurveyById(req.params.id,function(err,rows){
 
            if (err) {
              var reply = { "success": false, "err": err }
              res.json(reply);
            } else {
                
              var reply = { "success": true, "results": rows };
              res.json(reply);
            }
        });
    } 
});

module.exports=router;