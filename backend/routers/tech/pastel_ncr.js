const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()

app.post('/pastel_ncr', (req, res) => {
    let sos = JSON.parse(req.body.sos)
    sos = JSON.stringify(sos).replace(/[\[\]]+/g, "").replace(/"/g, "'")
    let sql = `SELECT * FROM pastel_ncr WHERE OrderNum IN (${sos})`
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.post('/add_pastel_ncr', (req, res) => {
    
    let new_rec = JSON.parse(req.body.new_rec)
    //let changes = JSON.parse(req.body.changes)
    for(i = 0; i<new_rec.length; i++) {
        let sql = `INSERT INTO pastel_ncr (AutoIndex, OrderNum, ExtOrderNum, ProjectName) VALUES ?`
        let values = [
            [
                new_rec[i].AutoIndex,
                new_rec[i].OrderNum,
                new_rec[i].ExtOrderNum,
                new_rec[i].ProjectName
            ]
        ]
        db.query(sql, [values], (err, result) => {
            if(err) {
                console.log(err)
            }
            
        })
    }

    res.end()
   
})

app.post('/save_maint', (req, res) => {
    let emp = req.body
    let changes = JSON.parse(emp.changes)
    
    console.log('changes = ', changes)
   
    for(let j = 0; j<changes.length; j++) { 
        let sql = "UPDATE pastel_ncr SET ";
        let keys = Object.keys(changes[j])
        let length = Object.keys(changes[j]).length
        for(let i = 0; i<length; i++) {
            //console.log(`${keys[i]} = ${changes[j][keys[i]]}`)
          
            if(i<length-2) {

                sql = sql + `${keys[i]} = ${JSON.stringify(changes[j][keys[i]])}` + ', '
            }
            if(i == length-1) {
                
                sql = sql + `${keys[i-1]} = ${JSON.stringify(changes[j][keys[i-1]])} WHERE id = ${changes[j].id}`
            }
        }
        console.log('sql = ', sql)
        db.query(sql, (err, result) => {
            if(err) {
                console.log(err)
            }
            else {
                if(j == changes.length-1) {
                    res.end()
                }
              
            }
        })
    }

      
})

app.post('/feedback', (req, res) => {
    let emp = req.body
    let products = JSON.parse(emp.products)
    console.log('products = ', products)
    products.forEach(p => {
        let sql = ''
        if(p.feedback == undefined) {
            p.feedback = null
        }
        /*else {
            p.feedback = JSON.stringify(p.feedback)
        }*/
        if(p.action == 'add') {
            
            sql = `INSERT INTO site_feedback (pastel_id, fitting, category, feedback) VALUES('${p.pastel_id}', '${p.fitting}', '${p.category}', ${p.feedback})`
        }
        if(p.action == 'modify') {
            delete p.qty
            delete p.note
            delete p.action
            let keys = Object.keys(p)
            let length = Object.keys(p).length
            console.log('p = ', p)
            console.log('length = ', length)
            if(length>0) { 
                sql = "UPDATE site_feedback SET ";
                
                for(let i = 0; i<length; i++) {
                    console.log(`${keys[i]} = ${p[keys[i]]}`)
                    if(i<length-2) {
                        sql = sql + `${keys[i]} = ${JSON.stringify(p[keys[i]])}` + ', '
                    }
                    if(i == length-1) {
                        sql = sql + `${keys[i-1]} = ${JSON.stringify(p[keys[i-1]])} WHERE id = ${p[keys[i]]}`
                    }
                }
            }

            //sql = `UPDATE site_feedback SET feedback = '${p.feedback}', category = '${p.category}' WHERE id = ${p.id}`
        }
        console.log('sql = ', sql)
        if(sql.length>0) {
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                }
            })
        }
    })

    res.end()    

})

app.post('/save_maint_comps', (req, res) => {
    let emp = JSON.parse(req.body.comps)
    console.log(req.body.maint_id)
    console.log('emp = ', emp)
    for(let i = 0; i<emp.length; i++) {
        let sql = `INSERT INTO maint_components(maint_id, Code, Description_1, qty, LatUCst) VALUES?`
        let values = [
            [
                req.body.maint_id,
                emp[i].Code,
                emp[i].Description_1,
                emp[i].qty,
                emp[i].LatUCst
            ]
        ]
        db.query(sql, [values], (err, result) => {
            if(err) {
                console.log(err)
            }
            else {
                res.end()
            }
        })
    }
    

})

app.post('/get_feedback', (req, res) => {
    let sql = `SELECT * FROM site_feedback WHERE pastel_id = ${req.body.id}`

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.post('/maint_comps', (req, res) => {
    let sql = `SELECT * FROM maint_components WHERE maint_id = ${req.body.id} AND active = 1`
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
