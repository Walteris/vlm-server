var db = require('../utils/dbconnection'); //reference of dbconnection.js
//var db = require('../utils/dbconnectionHana'); //reference of dbconnection.js
var querystring = require('querystring');
const https = require('https');

var User = {

    getAllUsers: function (callback)
    {
        return db.query("select U.T0014_ID as UserID, U.T0014_LastName as User_SurName, U.T0014_FirstName as User_FirstName " +
            ", C.T0024_ID as CompanyID, U.T0018_Primary_Language_Id as Primary_Language, U.T0018_Secondary_Language_Id as Secondary_Language, " +
            "C.T0024_Name as CompanyName, C.T0037_ID as ComunityID, C.T0074_RegionID as RegionID  , RC.T0074_RegionName as RegionName, " +
            "C.T0024_Division as Division, C.T0070_CountryID as CountryID, CC.T0070_CountryName as CountryName, C.T0024_TimePeriod as TimePeriod, " +
            "C.T0073_IndustryID as IndustryID, I.T0073_IndSubIndName Ind_Name, C.T0073_SubIndID as SubIndID," + 
            "SI.T0073_IndSubIndName as SIName, C.T0071_CurrencyID as CurrencyID, Cur.T0071_Abbreviation as Currency, " +
            "C.T0037_ID OrgLevelID, Com.T0037_Desc as Comm_Desc, UE.T0028_Email as User_Email " +
            "from t0014_users U " +
            "join t0049_surveys  S on S.T0014_ID = U.T0014_ID " +
            "join j0030_49_24_surveycompanyrelationship SCR on SCR.T0049_ID = S.T0049_ID " +
            "join t0024_companyorglevel C on C.T0024_ID = SCR.T0024_ID  " +
            "join t0074_regioncatalog RC on RC.T0074_RegionID = C.T0074_RegionID   " +
            "join t0070_countrycatalog CC on CC.T0070_CountryID = C.T0070_CountryID  " +
            "join t0073_indsubind I on I.T0073_IndSubIndID = C.T0073_IndustryID  " +
            "join t0073_indsubind SI on SI.T0073_IndSubIndID = C.T0073_SubIndID  " +
            "join t0071_currencycatalog Cur on Cur.T0071_CurrencyID = C.T0071_CurrencyID  " +
            "left join t0037_ve_cust_community Com on Com.T0037_ID = C.T0037_ID   " +
            "join t0028_user_emails UE on UE.T0014_ID = U.T0014_ID ", callback);

    },

    login: function (email, pass, callback)
    {
        //return db.query("Select * from task",callback);
        if (true)
        {
            callback(null, { "success": true, "apikey": "test", "first_name": "Tester", "last_name": "Tester" });        
        }
        else
        {
            callback({ "success": false, "err": "Login error" }, null);
        }
    },

    loginSocial: function (email, token, provider, callback) {
      //return db.query("Select * from task",callback);

      var host = "";
      var path = "";
      var headers = "";

      if (provider === 'linkedin') {
        host = 'api.linkedin.com';
        path = '/v1/people/~:(id,firstName,lastName,picture-url,email-address)?format=json';
        headers = { 'oauth_token': token };

      } else if (provider === 'facebook') {
        host = 'graph.facebook.com';
        path = '/v2.12/debug_token?input_token=' + token + '&access_token=590772914602357|645cb3c22e44e3cb5ddb6a8fff3986c4'; // app id  + '|' + secret

      } else if (provider === 'google') {
        host = 'www.googleapis.com';
        path = '/oauth2/v3/tokeninfo?id_token=' + token;
      } 

      if (host !== "") {        

        var options = { method: 'GET', host: host, path: path, headers: headers };

        var req = https.request(options, function (res) {

          res.on('data', (d) => {

            var obj = JSON.parse(d);

            console.log(obj);

            if (provider === 'linkedin') {
              if (obj.hasOwnProperty('errorCode')) {
                callback({ "success": false, "err": obj.message }, null);
              } else {
                if (obj.emailAddress !== email) {
                  callback({ "success": false, "err": "Email does not match" }, null);                  
                } else {
                  // todo - generate api key from db ?
                  callback(null, { "success": true, "apikey": "test", "first_name": "Tester", "last_name": "Tester" });
                }
              }
            } else if (provider === 'facebook') {
              if (obj.error) {
                callback({ "success": false, "err": obj.error.message }, null);
              } else {
                // todo - get email from facebook and compare if it match
                // todo - generate api key from db ?
                callback(null, { "success": true, "apikey": "test", "first_name": "Tester", "last_name": "Tester" });
              }
            } else if (provider === 'google') {
              if (!obj.hasOwnProperty('email')) {
                if (obj.hasOwnProperty('error_description')) {
                  callback({ "success": false, "err": obj.error_description }, null);
                } else {
                  callback({ "success": false, "err": 'Invalid token' }, null);
                }
              } else {
                if (obj.email !== email) {
                  callback({ "success": false, "err": "Email does not match" }, null);
                } else if (obj.uad !== '399849501114-nrc9gogltttgej174aqdeelgdq1bdfne.apps.googleusercontent.com') { // generated by google console for this app
                  callback({ "success": false, "err": "Invalid application" }, null);
                } else {
                  // todo - generate api key from db ?
                  callback(null, { "success": true, "apikey": "test", "first_name": "Tester", "last_name": "Tester" });
                }
              }
            } 
    
          });

        }).on('error', (e) => {
          console.error(e);
          callback({ "success": false, "err": e }, null);
        });

        req.end();
      } else {
        callback({ "success": false, "err": "Invalid provider" }, null);
      }

    },

    validateCaptcha: function (token, callback) {

        var postData = querystring.stringify({
            'secret': '6Ldxtk8UAAAAAPXa0oxqs8Fwf5jNWll9dHAUOtYT',
            'response': token
        });

        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        };

        var options = { method: 'POST', host: 'google.com', port: 443, path: '/recaptcha/api/siteverify', headers: headers };

        var req = https.request(options, function (res) {

            res.on('data', (d) => {

                var obj = JSON.parse(d);

                console.log(obj);

                // Success will be true or false depending upon captcha validation.
                if (obj.success !== undefined && !obj.success) {
                    callback(null, { "sucess": obj.success, "results": obj['error-codes'] });
                    return;
                }
                callback(null, { "success": obj.success, "results": obj })

            })
            res.on('error', (e) => {
                console.error(e);
                callback({ "success": false, "err": e }, null);
            });
        });

        req.write(postData);
        req.end();
    }
};

module.exports=User;