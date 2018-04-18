var db = require('../utils/dbconnection');
const https = require('https');

var Industry =
    {
        getAllIndustries: function (callback) {
            return db.query("select T0073_IndSubIndID as ID, T0073_IndSubIndName as Ind_SubInd, T0073_Parent_ID as Parent_ID " +
                "from t0073_indsubind " +
                "where T0073_Parent_ID = 0 " +
                "order by T0073_IndSubIndName", callback);
        }
    };

module.exports = Industry;
