const { Router } = require('express')
const sage = require('../../databases/sage')
var fun = require('../../functions/functions')
const async = require('async');
const app = Router()

app.post('/sage_codes', async (req, res) => {

    let codes = JSON.parse(req.body.codes)
    if(codes.length>0) {
        codes = JSON.stringify(codes).replace(/[\[\]]+/g, "").replace(/"/g, "'")
        
        let sql =   `SELECT StockLink, Code,Description_1
                    FROM [StkItem] WHERE Code IN (${codes})
                    
                    UNION 

                    SELECT AccountLink, Master_Sub_Account,Description
                    FROM [Accounts] WHERE Master_Sub_Account IN (${codes})`
        
       
        fun.executeStatement(sage, sql, function(error, results) {
            res.send(results)
        })
        
    }
    else {
        res.send([])
    }
    
 
})


app.get('/sage_projects', (req, res) => {
    let sql = `SELECT [ProjectLink],[ProjectCode],ProjectName+' '+'('+ProjectCode+')' AS DisplayName,[ProjectName],[ActiveProject],[ProjectDescription],[MasterSubProject]   
                FROM [Project]`

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    
})

app.get('/sage_reps', (req, res) => {
    let sql = `SELECT [idSalesRep],[Code],[Name]
                FROM [SalesRep]`

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
   
})

app.get('/sage_clients', (req, res) => {
    let sql = `SELECT [DCLink],[Account],[Name],[On_Hold]
            FROM [Client]`

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
   
})

app.get('/order_priority', (req, res) => {
    let sql = `SELECT [idIncidentPriority],[cDescription]
        FROM [_rtblIncidentPriority]`

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    
})

app.get('/warehouse', (req, res) => {
    let sql = `SELECT Code, Name FROM [WhseMst]` //
    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    
})

app.post('/sage_stock', async function (req, res) {
    //console.log(req.body.id)
    let quotes = JSON.parse(req.body.quotes)
    //console.log('quotes = ', quotes)
   
    let sql = ''
    if(quotes.length>0) {
        for(let i = 0; i<quotes.length; i++) {
            //console.log(`quotes[${i}] = `, quotes[i])
            if(i == 0) {
                if(quotes[i].Code.length>0) {
                    sql = `SELECT StockLink,Code,WhseLink,WhseCode,WhseName,Qty_On_Hand FROM [_bvStockAndWhseItems] WHERE Code = '${quotes[i].Code}' AND WhseCode =  '${quotes[i].Warehouse}' `
                }
                
            }
            else {
                if(quotes[i].Code.length>0) {
                    sql = sql + `UNION ALL` + ` SELECT StockLink,Code,WhseLink,WhseCode,WhseName,Qty_On_Hand FROM [_bvStockAndWhseItems] WHERE Code = '${quotes[i].Code}' AND WhseCode =  '${quotes[i].Warehouse}' `
                }
            }
           
        }
    }

    

    //console.log(sql)
    //res.end()
       
    if(quotes.length>0) {
        fun.executeStatement(sage, sql, function(error, results) {
            res.send(results)
        })
    }
    else {
        
    }
   
});

module.exports = app

