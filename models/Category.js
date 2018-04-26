var db=require('../utils/dbconnection'); //reference of dbconnection.js
 
var Category={
 
    getAllCategories:function(callback){
      return db.query("Select T0032_ID as id, T0032_Name as name from t0032_functional_levels where T0032_Name not like '%_OLD' order by T0032_Name", callback);
    },
    getCategoryById:function(id,callback){
      return db.query("Select T0032_ID as id, T0032_Name as name from t0032_functional_levels where T0032_ID=?", [id], callback);
    }
};

module.exports=Category;