var db=require('../utils/dbconnection'); //reference of dbconnection.js
 
var Kpi={
 
    getAllKpis:function(callback){
      return db.query("Select T0041_ID as id, T0041_Kpi_Name as name from t0041_kpimaster", callback);
    },
    getKpiById:function(id,callback){
      return db.query("Select T0041_ID as id, T0041_Kpi_Name as name from t0032_functional_levels where T0041_ID=?", [id], callback);
    }
};

module.exports=Kpi;