const { Router } = require('express')
const sfa = require('../../databases/sfa')
const async = require('async');
const app = Router()



app.get('/projects', async function (req, res) {
    let sql = "Select * from Project ORDER BY DateCreated DESC"
    /*executeStatement(sql, function(error, results) {
        res.send(results)
    })*/
    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        res.send(result.recordset)
    
    })
   
});

app.get('/accessories', (req, res) => {
    let sql = `SELECT * FROM nAccessory`
    /*executeStatement(sql, function(error, results) {
        res.send(results)
    })*/
    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        res.send(result.recordset)
    
    })
})

app.post('/quote_versions', (req, res) => {
    let sql = ""
    if(req.body.id != undefined) {
        sql = `SELECT QuotationID,QuotationStatusID,Description,QuotationKey,UseToEstimate,Version,IsLatest FROM [RegentSales].[dbo].[Quotation] t1
                WHERE t1.Version = 
                (SELECT max(Version) FROM [RegentSales].[dbo].[Quotation] t2 WHERE t2.QuotationKey = t1.QuotationKey AND ProjectID = ${req.body.id} AND QuotationStatusID IN ('6','9'))
                ORDER BY ExpectedOrderDate`
        /*sql = `SELECT QuotationID,QuotationStatusID,Description,QuotationKey,UseToEstimate,Version,IsLatest
                FROM [RegentSales].[dbo].[Quotation] WHERE ProjectID = ${req.body.id} AND QuotationStatusID IN ('6','9')/*AND UseToEstimate = 1 AND IsLatest = 1*C/
                ORDER BY IsLatest DESC, Version DESC`*/
    }
    if(req.body.no != undefined) {
        sql = `SELECT QuotationID,QuotationStatusID,Description,QuotationKey,UseToEstimate,Version,IsLatest FROM [RegentSales].[dbo].[Quotation] t1
                WHERE t1.Version = 
                (SELECT max(Version) FROM [RegentSales].[dbo].[Quotation] t2 WHERE t2.QuotationKey = t1.QuotationKey AND QuotationID = '${req.body.no}' AND QuotationStatusID IN ('6','9'))`
        /*sql = `SELECT QuotationID,QuotationStatusID,Description,QuotationKey,UseToEstimate,Version,IsLatest
                FROM [RegentSales].[dbo].[Quotation] WHERE QuotationID = '${req.body.no}' AND QuotationStatusID IN ('6','9')/*AND UseToEstimate = 1 AND IsLatest = 1*C/
                ORDER BY IsLatest DESC, Version DESC`*/
    }
    //console.log('sql = ', sql)
    /*executeStatement(sql, function(error, results) {
        res.send(results)
    })*/
    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        res.send(result.recordset)
    
    })
})

app.post('/project_quotes', async function (req, res) {
    //console.log(req.body.id)
    let quotes = JSON.parse(req.body.quotes)
    console.log('quotes = ', quotes)
    //quotes = JSON.stringify(quotes).replace(/[\[\]]+/g, "").replace(/"/g, "'")

    //console.log(req.body.no)
    //let sql = `SELECT * FROM [RegentSales].[dbo].[v_ProjectQuotes] WHERE QuotationID IN (${quotes}) ORDER BY ItemID`
    let sql = ''
    if(quotes.length>0) {
        for(let i = 0; i<quotes.length; i++) {
            //console.log(`quotes[${i}] = `, quotes[i])
            if(i == 0) {
                sql = `SELECT * FROM [RegentSales].[dbo].[v_ProjectQuotes] WHERE QuotationID = ${quotes[i]} AND ItemID is not null `
            }
            else {
                sql = sql + `UNION ALL` + ` SELECT * FROM [RegentSales].[dbo].[v_ProjectQuotes] WHERE QuotationID = ${quotes[i]} AND ItemID is not null `
            }
            
            /*if(i < quotes.length-1) {
                sql = sql + `UNION ALL`
            }*/
        }
    }

    

    console.log(sql)
    //res.end()
       
    if(quotes.length>0) {
        sfa.query(sql, function (err, result) {
                
            if (err) {
                res.json({type: 'ERROR', message: err.message})
                console.log(err)
            }
            else {
                console.log('project_quotes result.recordset.length = ', result.recordset.length)
                res.send(result.recordset)
            }
            
        
        })
    }
    else {
        res.json({type: 'ERROR', message: 'Project has no approved quotes'})
    }
   
});




app.post('/update_sfa', (req, res) => {
    let emp = req.body
    let sql = ""
    if(emp.type == 'project') {
        sql = `UPDATE Project SET ProjectStatusID = ${emp.status} WHERE ProjectID = ${emp.no}`
    }
    if(emp.type == 'quote') {
        sql = `UPDATE Quotation SET QuotationStatusID = ${emp.status} WHERE QuotationID = ${emp.no}`
    }
    console.log('sql = ', sql)
    /*executeStatement(sql, function(error, results) {
        res.send(results)
    })*/
    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        res.send(result.recordset)
    
    })
})


module.exports = app