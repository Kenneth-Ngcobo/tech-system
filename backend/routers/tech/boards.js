const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()


app.get('/boards', function (req, res) {
    let sql = 'SELECT * from boards'
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
  })

  app.get('/em_units', (req, res) => {
    let sql = `SELECT * FROM emergency`
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
  })

  module.exports = app