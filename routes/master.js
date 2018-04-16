var express = require('express');
var router = express.Router();
var Region = require('../models/Region');
var Country = require('../models/Country');
var Currency = require('../models/Currency');
var Industry = require('../models/Industry');
var SubIndustry = require('../models/SubIndustry');

router.get('/:type?',function(req,res,next){
 
    if(req.params.type == 'public'){
       
      Country.getAllCountries(function (err, rows) {
 
        if (err) {
          res.json(err);
        }
        else {         
          
          var master = { info: null, countries: null, regions: null, currencies: null };

          master.info = { version: '1.0.0' };

          master.countries = rows;          

          Region.getAllRegions(function (err, rows) {
            if (err) {
              res.json(err);
            }
            else {

              master.regions = rows;

              Currency.getAllCurrencies(function (err, rows) {
                if (err) {
                  res.json(err);
                }
                else {

                  master.currencies = rows;
                  res.json({ "success": true, "results": master });
                }
              });             
            }
          });
          
        }
      });
    } 
});


module.exports=router;