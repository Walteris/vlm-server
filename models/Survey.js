var db = require('../utils/dbconnection'); //reference of dbconnection.js

var Survey = {

  getSurveyById: function (id, callback) {

    var sql;

    // sql =
    //   "select distinct S.T0049_ID, SS.T0005_Page, SS.T0005_Hierarchy, TR.T0004_Config_Order, AD.T0006_ID, AD.T0006_Desc,  SS.T0008_ID as objectID, A.T0008_Desc , AP.T0008_Parent_ID, AA.T0008_Desc, D.T0009_ID, D.T0009_Desc, " +
    //   "A.T0003_ID, OT.T0003_Desc as texttype, AT.T0004_ID, TR.T0004_Desc as objtype, L.T0018_ID, L.T0018_Desc as Language, AT.T0012_ID, T.T0012_Text as valuetext, T.T0012_Display_Cfg as displaycfg, T.T0012_Control_Cfg, " +
    //   "AT.T0019_AutoID as autoID, CR.T0017_AutoID,  CR.T0017_Cust_Resp custresp, CA.T0069_AutoID, U.T0014_ID User_ID, U.T0014_LastName, U.T0014_FirstName, UE.T0028_Email Email_Assignee,  CA.T0014_ID_Assigner, " +
    //   "SS.T0005_Duplicate, SS.T0005_Web_Mobile " +
    //   "from t0049_surveys S " +
    //   "join j0005_1_8_survey_structure SS on SS.T0001_ID  = S.T0001_ID  and SS.T0005_Web_Mobile in (1,3) " +
    //   "join t0008_assets A on A.T0008_ID= SS.T0008_ID   " +
    //   "join c0003_objects_types OT on OT.T0003_ID = A.T0003_ID " +
    //   "left join c0006_assets_it_def_types AD on AD.T0006_ID = A.T0006_ID  " +
    //   "left join j0063_8_9 JD on JD.T0008_ID = A.T0008_ID " +
    //   "left join c0009_assets_bus_fct_domains D on D.T0009_ID = JD.T0009_ID  " +
    //   "join j0019_8_12_assets_to_ml_text `AT` on AT.T0008_ID= SS.T0008_ID  " +
    //   "join c0004_text_roles TR on TR.T0004_ID = AT.T0004_ID  " +
    //   "join l0012_text T on T.T0012_ID  = AT.T0012_ID " +
    //   "join c0018_languages L on L.t0018_id=  T.T0018_ID  " +
    //   "left join j0069_49_8_14_cust_assignment CA on CA.T0008_ID = A.T0008_ID and CA.T0049_ID = S.T0049_ID " +
    //   "left join j0059_8_8_assets AP on AP.T0008_ID = A.T0008_ID " +
    //   "left join j0017_49_8_14_cust_responses CR on CR.T0008_ID = A.T0008_ID " +
    //   "left join t0014_users U on U.T0014_ID = CA.T0014_ID_Assignee " +
    //   "left join t0028_user_emails UE on UE.T0014_ID = U.T0014_ID " +
    //   "left join t0008_assets AA on AA.T0008_ID = AP.T0008_Parent_ID  " +
    //   "where S.T0049_ID=? " +
    //   "order by SS.T0005_Page, SS.T0005_Hierarchy";

      sql = "SELECT * FROM survey_flat WHERE T0049_ID=? ORDER BY T0005_Page, T0005_Hierarchy"
    return db.query(sql, [id], callback);
  }
};

module.exports = Survey;