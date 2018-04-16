var mysql = require('mysql');
var connection = mysql.createPool({

    host: 'bbb',
    user: 'aaa',
    password: 'xxx',
    database: 'yyy'

});
module.exports = connection;