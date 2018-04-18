var db = require('../utils/dbconnection');
const https = require('https');

var Currency =
    {
        getAllCurrencies: function (callback) {
            return db.query("Select T0071_CurrencyID as ID, T0071_CurrencyCode as CurrencyCode,  T0071_Abbreviation as Abbreviation, T0071_CurrencySymbol as CurrencySymbol, " +
                "T0071_ConversionValue as ConversionValue, T0071_From_Date as From_Date, T0071_To_Date as To_Date " +
                "from t0071_currencycatalog " +
                "order by T0071_CurrencySymbol", callback);
        }
    };

module.exports = Currency;