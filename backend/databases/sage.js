var Connection = require('tedious').Connection


var sageConnect = { //sfaConnect
    "server": "192.168.16.4", //"192.168.16.94",
    
    "authentication": {
      "type": "default",
      "options": {
        "userName": "sa",//"regentsfa",
        "password": "W@Hl!@",//"regentsfa"
      }
    },
    "options": {
      "port": 50021,
      "encrypt": false, 
      "trustServerCertificate": true,
      "database": "Wahl-Live", //Wahl-Live //DocMgr
      "validateBulkLoadParameters": false,
      "rowCollectionOnRequestCompletion": true,
    }
  }

/*let sage = new Connection(sageConnect)

sage.on('connect', (err) => {
    if(err) {
        console.log(err)
    }
    else {
        console.log('Connected to Sage!')
    }
})


sage.connect()

module.exports = sage*/