var db = require('../utils/dbconnection');
const https = require('https');

var Region =
{
    getAllRegions: function (callback)
    {
        return db.query("Select * from  tbl_regioncatalog RC order by RC.Name", callback);
    }
};

module.exports = Region;