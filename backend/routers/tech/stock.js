const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()

app.get('/stock_products', function (req, res) {
    let sql = 'SELECT * from stock WHERE active = 1'
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.post('/add_product', function (req, res) {
    let emp = req.body
    let sql = 'INSERT INTO stock (prio, name, code, length, colour, current, cct, lens, min, max, stock, comments, available) VALUES ?'
    let values = [
        [
            emp.prio, emp.name, emp.code, emp.length, emp.colour, emp.current, emp.cct, emp.lens, emp.min, emp.max, emp.stock, emp.comments, emp.available
        ]
    ]
    console.log('add_product sql = ', sql)
    db.query(sql, [values], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            console.log('add_product result = ', result)
            res.send(result)
        }
    })
  })

  app.get('/driver_stock', (req, res) => {
    let sql = `SELECT * FROM driver_stock WHERE active = 1`
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})



app.post('/driver_stock_changes', (req, res) => {
    let emp = req.body
    let changes = JSON.parse(emp.changes)

    for(let i = 0; i<changes.length; i++) {
        let sql = "Update driver_stock SET "
        let length = Object.keys(changes[i]).length
        let keys = Object.keys(changes[i])

        for(let j = 0; j<length; j++) {
            if(j < length-2) {
                sql = sql + `${keys[j]} = ${JSON.stringify(changes[i][keys[j]])}` + ', '
            }
            if(j == length-1) {
                sql = sql + `${keys[j-1]} = ${JSON.stringify(changes[i][keys[j-1]])} WHERE id = ${changes[i].id}`
            }
        }
        db.query(sql, (err, result) => {
            if(err) {
                console.log(err)
            }
            else {
                if(i == changes.length-1) {
                    res.end()
                }
            }
        })
    }


})

app.post('/add_driver', function (req, res) {
  let emp = req.body
  let sql = 'INSERT INTO driver_stock (code, description, part_no, type, supplier, vf, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, `Dec`) VALUES ?'
  let values = [
      [
          emp.code, emp.description, emp.part_no, emp.type, emp.supplier, emp.vf, emp.Jan, emp.Feb, emp.Mar, emp.Apr, emp.May, emp.Jun, emp.Jul, emp.Aug, emp.Sep,
          emp.Oct, emp.Nov, emp.Dec
      ]
  ]
  db.query(sql, [values], (err, result) => {
      if(err) {
          console.log(err)
      }
      else {
          res.send(result)
      }
  })
})


app.get('/drivers', function (req, res) {
  let sql = 'SELECT * from drivers'
  db.query(sql, (err, result) => {
      if(err) {
          console.log(err)
      }
      else {
          res.send(result)
      }
  })
})

app.get('/joined_drivers', function (req, res) {
  let sql = 'SELECT MIN(id) AS id, name, wattage, type, MIN(min_voltage) as min_voltage, MAX(max_voltage) as max_voltage, MIN(current) as current, MIN(current) as min_current, MAX(current) as max_current, dimming, price, form_factor, dimensions, manufacturer\
  FROM drivers\
  GROUP BY name'
  db.query(sql, (err, result) => {
      if(err) {
          console.log(err)
      }
      else {
          res.send(result)
      }
  })
})


app.post('/change_stock', (req, res) => {
    
    let emp = req.body
    let changes = JSON.parse(emp.changes)
   

      for(let i = 0; i<changes.length; i++) {
          let sql = "Update stock SET "
          let length = Object.keys(changes[i]).length
          let keys = Object.keys(changes[i])
       

          for(let j = 0; j<length; j++) {
              if(j < length-2) {
                  sql = sql + `${keys[j]} = ${JSON.stringify(changes[i][keys[j]])}` + ', '
              }
              if(j == length-1) {
                  sql = sql + `${keys[j-1]} = ${JSON.stringify(changes[i][keys[j-1]])} WHERE id = ${changes[i].id}`
              }
          }
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                }
                else {
                    if(i == changes.length-1) {
                        res.end()
                    }
                }
            })
        }

})

app.get('/products', function (req, res) {
    let sql = 'SELECT * from products'
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
