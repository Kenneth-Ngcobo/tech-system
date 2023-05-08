const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()

app.post('/product_report', (req, res) => {
    let emp = req.body
    let sql = ''
    if(emp.issue == 'All') {
        sql = `SELECT np.ncr_no, CONCAT(n.project, n.department) as site, product_name, wattage, length, mounting, bb, qty, category, failure  FROM technical.ncr_products np
        JOIN ncr n ON n.ncr_no = np.ncr_no
        WHERE product_name LIKE '%${emp.selected}%' ORDER BY ABS(qty) DESC;`
    }
    else {
        sql = `SELECT np.ncr_no, CONCAT(n.project, n.department) as site, product_name, wattage, length, mounting, bb, qty, category, failure  FROM technical.ncr_products np
        JOIN ncr n ON n.ncr_no = np.ncr_no
        WHERE product_name LIKE '%${emp.selected}%' AND category LIKE '%${emp.issue}%' ORDER BY ABS(qty) DESC;`
    }
     

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

app.get('/fault_count', (req, res) => {
    const sql = "SELECT COUNT(CASE WHEN category LIKE '%Faulty PCB%' THEN 1 END) AS 'Faulty PCB',\
    COUNT(CASE WHEN category LIKE '%Faulty Driver%' THEN 1 END) AS 'Faulty Driver',\
    COUNT(CASE WHEN category LIKE '%Loose Connection%' THEN 1 END) AS 'Loose Connection', COUNT(CASE WHEN category LIKE '%Incorrect Wiring%' THEN 1 END) AS 'Incorrect Wiring', COUNT(CASE WHEN category LIKE '%Dimming issue%' THEN 1 END) AS 'Dimming Issue',\
    COUNT(CASE WHEN category LIKE '%Water/Moister Ingress%' THEN 1 END) AS 'Water Ingress', COUNT(CASE WHEN category LIKE '%Incorrect Spec%' THEN 1 END) AS 'Incorrect Spec', COUNT(CASE WHEN category LIKE '%Poor Quality%' THEN 1 END) AS 'Poor Quality',\
    COUNT(CASE WHEN category LIKE '%Overheating%' THEN 1 END) AS Overheating FROM technical.ncr_products";

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

app.get('/supplier_faults', (req, res) => {
    const sql = "SELECT supplier, sum(qty) AS qty FROM technical.ncr_components WHERE length(supplier) > 0 and qty > 1 group by supplier order by qty DESC;"

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

app.get('/suppliers', (req, res) => {
    const sql = "SELECT * FROM technical.suppliers order by supplier;"

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

app.post('/fault_cat', (req, res) => {

    var sql = ''
    let emp = req.body

    let min_date = JSON.stringify(emp.from)
    let max_date = JSON.stringify(emp.to)

    
    if(emp.issue != 'All') { //Have issue category
        sql = `SELECT p.product_name, SUM(ABS(p.qty)) AS qty \n
        FROM (technical.ncr_products p JOIN technical.ncr n ON p.ncr_no = n.ncr_no) \n
        WHERE p.category like '%${emp.issue}%'`
        if(emp.to.length>0 && emp.from.length == 0) {
            sql = sql + ` && p.date <= ${max_date}`
        }
        if(emp.to.length == 0 && emp.from.length > 0) {
            sql = sql + ` && p.date >= ${min_date}`
        }
        if(emp.to.length > 0 && emp.from.length > 0) {
            sql =  sql + ` && p.date >= ${min_date} && p.date <= ${max_date}`
        }
        if(emp.type != 'All') {
            sql = sql + ` && n.type = ${JSON.stringify(emp.type)}`
        }
        sql = sql + ` GROUP BY p.product_name HAVING qty >= ${emp.qty} order by qty DESC;` 
        
    }
    else { //Don't have issue category
        sql = `SELECT p.product_name, SUM(ABS(p.qty)) AS qty \n
        FROM (technical.ncr_products p JOIN technical.ncr n ON p.ncr_no = n.ncr_no) \n
        WHERE n.id>0`
        /*if(emp.to.length>0 && emp.from.length>0) {
            sql = sql = `WHERE`
        }*/
        if(emp.to.length>0 && emp.from.length == 0) {
            sql = sql + `  && p.date <= ${max_date}`
        }
        if(emp.to.length == 0 && emp.from.length > 0) {
            sql = sql + ` && p.date >= ${min_date}`
        }
        if(emp.to.length > 0 && emp.from.length > 0) {
            sql =  sql + ` && p.date >= ${min_date} && p.date <= ${max_date}`
        }
        if(emp.type != 'All') {
            sql = sql + ` && n.type = ${JSON.stringify(emp.type)}`
        }
        sql = sql + ` GROUP BY p.product_name HAVING  qty >= ${emp.qty} order by qty DESC;` 
    }
    
    console.log('sql = ', sql)

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
    
})

module.exports = app
