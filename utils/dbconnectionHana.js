var hana = require('@sap/hana-client');

var client = hana.createConnection({ uid: 'xxxxx', pwd: 'yyyy' });

client.connect("serverNode=aaa",
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected');
        }
    });             //3$(SAPSYSTEM)62




module.exports = client;
