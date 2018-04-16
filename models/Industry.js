var db = require('../utils/dbconnection');
const https = require('https');

var Industry =
    {
        getAllIndustries: function (callback) {
            return db.query("select * from tbl_indsubind where Parent_ID = 0 order by Ind_SubInd", callback);
        }
    };

module.exports = Industry;
