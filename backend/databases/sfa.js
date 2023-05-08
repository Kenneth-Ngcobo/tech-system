var mssql = require('mssql')

const sfaConnect = { 
    user: 'regentsfa', 
    password: 'regentsfa',
    database: 'RegentSales', 
    server: '192.168.16.94',
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  }



/*mssql.connect(sfaConnect)

let sfa = new mssql.Request()

module.exports = sfa*/