var express = require('express');
var router = express.Router();
var Category=require('../models/Category');
 
router.get('/:id?',function(req,res,next){
 
    if(req.params.id){
 
        Category.getCategoryById(req.params.id, function (err, rows)
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
    }
    else
    {
        Category.getAllCategories(function (err, rows)
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
    }
});

module.exports=router;