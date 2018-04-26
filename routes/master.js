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

          var master = { info: null, countries: null, regions: null, currencies: null, industries: null, subindustries: null };

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

                  // remove eur
                  var idx = rows.findIndex(function(k) {
                    return k["CurrencyCode"] == "EUR";
                  });

                  if (idx >= 0) {
                    rows.splice(idx, 1);
                  }

                  // add eur and usd at begining
                  rows.unshift({ "ID": 1057, "CurrencyCode": "USD", "Abbreviation": "USD", "CurrencySymbol": "USD", "ConversionValue": 1, "From_Date": "2018-03-14T06:00:14.000Z", "To_Date": "2030-01-01T05:00:00.000Z" });
                  rows.unshift({ "ID": 1058, "CurrencyCode": "EUR", "Abbreviation": "EUR", "CurrencySymbol": "EUR", "ConversionValue": 1, "From_Date": "2018-03-14T06:00:14.000Z", "To_Date": "2030-01-01T05:00:00.000Z" });

                  
                  master.currencies = rows;

                  Industry.getAllIndustries(function (err, rows) {
                    if (err) {
                        res.json(err);
                    }
                    else {

                      master.industries = rows;

                      SubIndustry.getAllSubIndustries(function (errr, rows) {
                        if (err) {
                            res.json(err);
                        } else {

                          master.subindustries = rows;

                          res.json({ "success": true, "results": master });
                        }
                      });
                    }
                  });
                }
              });             
            }
          });
        }
      });
    } 
});


module.exports=router;