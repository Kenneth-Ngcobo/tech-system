const { Router } = require('express')
const sage = require('../../databases/sage')
var fun = require('../../functions/functions')
const app = Router()


app.get('/vendors', (req, res) => {
    let sql = `SELECT DCLink,Account,Name + ' - ' + Account AS Name,Title,Init,Contact_Person,Physical1,Physical2,Physical3,Physical4,Physical5,PhysicalPC FROM [Vendor]` //
    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    
})

app.post('/pos', (req, res) => {
    let emp = req.body
    let sql = `SELECT 
                IL.idInvoiceLines, AutoIndex,DocType,DocVersion,OrderNum,ExtOrderNum,I.Code, IL.cDescription, IL.fQtyProcessed as Quantity, IL.fUnitPriceExcl AS Price, DocRepID,InvNumber,GrvNumber,GrvID,AccountID,Description,InvDate,OrderDate,DueDate,
                DeliveryDate,TaxInclusive,Email_Sent,DeliveryNote,cTaxNumber,cAccountName       
                FROM [InvNum] H
                FULL JOIN [_btblInvoiceLines] IL ON H.AutoIndex = IL.iInvoiceID
                FULL JOIN [StkItem] I ON IL.iStockCodeID = I.StockLink
                WHERE AccountID = ${"'"+emp.vendor+"'"} AND OrderDate <= '${emp.to}' AND OrderDate >= '${emp.from}'
                ORDER BY OrderDate`
    console.log(sql)
    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
   
})

app.post('/supplier_aud', (req, res) => {
    let emp = req.body
    let sql = `SELECT [AutoIndex],[AccountID],[cAccountName],[OrderNum],CONVERT(date, [OrderDate]) AS [OrderDate],CONVERT(date, [DueDate]) AS [DueDate]    
                ,CONVERT(date, [DeliveryDate]) AS [DeliveryDate],CONVERT(date, [InvDate]) AS [InvDate],[DocType]
                ,[DocVersion],[DocState],[DocFlag],[OrigDocID],[InvNumber],[GrvNumber],[GrvID],[Description]
                FROM [InvNum] WHERE DocType = '5' AND OrderDate >= '${emp.from}' AND OrderDate <= '${emp.to}' AND AccountID = '${emp.id}' AND LEN(GrvNumber) > 0
                ORDER BY OrderDate`
                
    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
})

module.exports = app