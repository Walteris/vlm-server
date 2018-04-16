var express = require('express');
var router = express.Router();
var User = require('../models/User');
var helpers = require('../utils/helpers');
//var request = require('request');

const constants = require('../utils/constants');

/* GET users listing. */
router.get('/', function (req, res, next) {
    User.getAllUsers(function (err, rows) {

        if (err) {
            res.json(err);
        } else {
            res.json({ "success": true, "results": rows });
        }
    });
});

router.get('/loginuser/:email?', function (req, res, next) {

  if (req.query.consumer_key && req.query.consumer_key === constants.systemUser) {

    if (req.params.email) {

        if (req.query.pass) {

            User.login(req.params.email, req.query.pass, function (err, result) {

              if (err) {
                res.json(err);
              } else {
                res.json(result);
                //res.json(rows);
              }
            });

        } else if (req.query.token && req.query.provider) {

            User.loginSocial(req.params.email, req.query.token, req.query.provider, function (err, result) {
              if (err) {
                res.json(err);
              } else {
                res.json(result);
                //res.json(rows);
              }
            });
          } else {
            res.json(helpers.vlmErr("Password missing"));
          }
      } else {
        res.json(helpers.vlmErr("Email missing"));
      }
  } else {
    res.json(helpers.vlmErr("Unauthorized"));
  }

});

router.get('/validatecaptcha', function (req, res, next) {
    if (req.query.consumer_key && req.query.consumer_key === constants.systemUser) {

        if (req.query.token) {

            User.validateCaptcha(req.query.token, function (err, result) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(result);
                }
            });

        } else {
            res.json(helpers.vlmErr("Token missing"));
        }
    } else {
        res.json(helpers.vlmErr("Unauthorized"));
    }
});
module.exports = router;
