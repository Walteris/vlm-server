var db = require('../utils/dbconnection');
const https = require('https');

var Country =
    {
        getAllCountries: function (callback) {
            return db.query("Select CC.T0070_CountryID as ID, CC.T0070_CountryName as Name, CC.T0074_RegionID as Region_Catalog_ID from t0070_countrycatalog CC order by CC.T0070_CountryName", callback);
        },

        getCountriesByRegionId: function (region_id, callback) {
            return db.query("Select CC.T0070_CountryID as ID, CC.T0070_CountryName as Name, CC.T0074_RegionID as Region_Catalog_ID from t0070_countrycatalog CC where CC.T0074_RegionID=? order by CC.T0070_CountryName", [region_id], callback);
        }
    };

module.exports = Country;