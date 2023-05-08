
var mysql = require('mysql2');

var db = mysql.createConnection({
    host:'localhost', //localhost //--Server---- 192.168.16.94
    user: 'root', //kenneth //--Server----kenneth OR root (doesn't work locally only the server) root password = Nk.880620
    password: 'k3nn3th!', //k3nn3th! //--Server---- k3nn3th! OR FoundryTemp01! (doesn't work locally only the server)
    database: 'technical',
    multipleStatements: true,
    dateStrings: true
})
  
db.connect()

module.exports = db