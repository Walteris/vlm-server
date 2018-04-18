var db = require('../utils/dbconnection');
const https = require('https');

var SubIndustry =
    {
        getAllSubIndustries: function (callback)
        {
            return db.query("Select SI.T0073_IndSubIndID as S_IndID, SI.T0073_IndSubIndName as S_Ind_Name, SI.T0073_Parent_ID Ind_ID, I.T0073_IndSubIndName as IndName " +
                "from t0073_indsubind SI " +
                "left join t0073_indsubind I on I.T0073_IndSubIndID = SI.T0073_Parent_ID " +
                "where SI.T0073_Parent_ID <> 0 " +
                "order by SI.T0073_IndSubIndName", callback);
        },

        getSubIndustriesByParentId: function (parent_id, callback)
        {
            return db.query("Select SI.T0073_IndSubIndID as S_IndID, SI.T0073_IndSubIndName as S_Ind_Name, SI.T0073_Parent_ID Ind_ID, I.T0073_IndSubIndName as IndName " +
                "from t0073_indsubind SI " +
                "left join t0073_indsubind I on I.T0073_IndSubIndID = SI.T0073_Parent_ID " +
                "where SI.T0073_Parent_ID = ? " +
                "order by SI.T0073_IndSubIndName", [parent_id], callback);
        }
    };

module.exports = SubIndustry;