var db=require('../utils/dbconnection'); //reference of dbconnection.js
 
var Domain={
 
    getAllDomains:function(callback){
      return db.query("Select T0009_ID as id, T0009_Desc as name from c0009_assets_bus_fct_domains", callback);
    },
    getDomainById:function(id,callback){
      return db.query("Select T0009_ID as id, T0009_Desc as name from c0009_assets_bus_fct_domains where T0009_ID=?", [id], callback);
    }
};

module.exports=Domain;