var db = require('../utils/dbconnection');
const https = require('https');

var Country =
    {
        getAllCountries: function (callback) {
            return db.query("Select * from tbl_countrycatalog CC order by CC.Name", callback);
        },

        getCountriesByRegionId: function (region_id, callback) {
            return db.query("Select * from tbl_countrycatalog CC where CC.Region_Catalog_ID=? order by CC.Name", [region_id], callback);
        }
    };

module.exports = Country;