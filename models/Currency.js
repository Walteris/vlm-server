var db = require('../utils/dbconnection');
const https = require('https');

var Currency =
    {
        getAllCurrencies: function (callback) {
            return db.query("Select * from tbl_currencycatalog order by CurrencySymbol", callback);
        }
    };

module.exports = Currency;