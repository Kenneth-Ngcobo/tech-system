const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()

app.post('/add_project', (req, res) => {
    let emp = req.body
    let sql = `INSERT INTO projects(name,client,region,rep,start_date,end_date,status,team,quote_no,so,address,cost) VALUES?`

    let values = [
        [
            emp.name, emp.client, emp.region, emp.rep, emp.start_date, emp.end_date, emp.status, emp.team, emp.quote_no, emp.so, emp.address, emp.cost
        ]
    ]

    db.query(sql, [values], (err, results) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(results)
        }
    })

})


app.get('/maint_projects', (req, res) => {
    let sql = `SELECT * FROM projects`
    
    db.query(sql, (err, results) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(results)
        }
    })
})

module.exports = app
