
const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()

app.post('/driver_match', function (req, res) {
    let emp = req.body
    //console.log('emp = ', emp)
    let sql = 'SELECT * FROM drivers  where max_voltage > ? && min_voltage < ? && current = ? order by wattage'
    db.query(sql, [emp.typ_volt, emp.typ_volt, emp.current], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
  })


  

  app.get('/uploads', function (req, res) {
        console.log('req.params = ', req.params)
        res.send({msg:'This is uploads'})
        //res.sendFile(__dirname, '/uploads/file-1618948334613-AQUA FITTING THERMAL REPORT.docx');
  })



app.get('/bom', (req, res) => {
    let emp = req.body
    let sql = `SELECT BomComponentKey,	BomMasterKey,	ComponentStockLink,	Description,	ProductionQty, BomID, ComponentIndex
            FROM [_bvBOMCompStock] WHERE BomMasterKey = '${emp.id}'
            
            UNION
            
            SELECT comp.BomComponentKey,	comp.BomMasterKey,	comp.ComponentStockLink,	comp.Description,	comp.ProductionQty, comp.BomID, comp.ComponentIndex
            FROM [_bvBOMCompStock] sub
            JOIN [_bvBOMCompStock] comp
            ON sub.BomID = comp.BomMasterKey
            WHERE sub.BomMasterKey = '${emp.id}'`
            
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