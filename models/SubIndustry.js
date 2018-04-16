var db = require('../utils/dbconnection');
const https = require('https');

var SubIndustry =
    {
        getAllSubIndustries: function (callback)
        {
            return db.query("Select SI.ID S_IndID, SI.Ind_SubInd S_Ind_Name, SI.Parent_ID Ind_ID, I.Ind_SubInd IndName " +
                "from tbl_indsubind SI " +
                "left join tbl_indsubind I on I.ID = SI.Parent_ID " +
                "where SI.Parent_ID <> 0 " +
                "order by SI.Ind_SubInd", callback);
        },

        getSubIndustriesByParentId: function (parent_id, callback)
        {
            return db.query("Select SI.ID S_IndID, SI.Ind_SubInd S_Ind_Name, SI.Parent_ID Ind_ID, I.Ind_SubInd IndName " +
                "from tbl_indsubind SI " +
                "left join tbl_indsubind I on I.ID = SI.Parent_ID " +
                "where SI.Parent_ID = ? " +
                "order by SI.Ind_SubInd", [parent_id], callback);
        }
    };

module.exports = SubIndustry;