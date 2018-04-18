var db = require('../utils/dbconnection');
const https = require('https');

var Region =
{
    getAllRegions: function (callback)
    {
        return db.query("Select T0074_RegionID as ID, T0074_RegionName as Name " +
            "from t0074_regioncatalog RC " +
            "order by RC.T0074_RegionName", callback);
    }
};

module.exports = Region;