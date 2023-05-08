const { Router } = require('express')
const sage = require('../../databases/sage')
var fun = require('../../functions/functions')
const app = Router()

app.post('/stock', function(req, res) {
    let emp = JSON.parse(req.body.products)
    let codes = emp.map(s => s.code)
    codes = JSON.stringify(codes).replace(/[\[\]]+/g, "").replace(/"/g, "'")
    let sql  = `SELECT StockLink, Code, Description_1, Re_Ord_Lvl, Re_Ord_Qty, Min_Lvl, Max_Lvl, AveUCst, LatUCst, LowUCst,
    HigUCst, StdUCst, Qty_On_Hand, WHQtyOnHand AS Qty, WHQtyOnSO, ItemActive, ReservedQty, QtyOnPO, QtyOnSO, BomCode, JobQty
    FROM [StkItem] I
    JOIN [WhseStk] WS ON I.StockLink = WS.WHStockLink
    WHERE Code IN (${codes}) AND WHWhseID = '4'`

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    

})

app.post('/stock2', function(req, res) {
    let emp = JSON.parse(req.body.products)
    //console.log(emp)
    let codes = emp.map(s => s.code)
    codes = JSON.stringify(codes).replace(/[\[\]]+/g, "").replace(/"/g, "'")
    let sql  = `SELECT StockLink, Code, Description_1, Re_Ord_Lvl, Re_Ord_Qty, Min_Lvl, Max_Lvl, AveUCst, LatUCst, LowUCst,
        HigUCst, StdUCst, Qty_On_Hand, WHQtyOnHand AS Qty, WHQtyOnSO, ItemActive, ReservedQty, QtyOnPO, QtyOnSO, BomCode, JobQty
        FROM [StkItem] I
        JOIN [WhseStk] WS ON I.StockLink = WS.WHStockLink
        WHERE Code IN (${codes}) AND WHWhseID = '8'`

        fun.executeStatement(sage, sql, function(error, results) {
            res.send(results)
        })
   
})

app.get('/stock3', (req, res) => {
    let sql = `SELECT [StockLink]
            ,[Code]
            ,[cSimpleCode]
            ,[cExtDescription]
            ,[ItemGroup]
            ,[ItemGroupDescription]
            ,[iBinLocationID]
            ,[BinLocationName]
            ,[WhseCode]
            ,[WhseName]
            ,[QtyInStock]
            ,[Qty_On_Hand]
            ,[ReservedQty]
            ,[QtyOnPO]
            ,[QtyOnSO]
            ,[fExclPrice]
        FROM [_bvStockAndWhseItems] S
        JOIN [_evPriceListPricesFull] P ON S.Code = P.ItemCode
        WHERE WhseCode = '20' AND Qty_On_Hand > 0 AND cName = 'Projects'
        ORDER BY Code`

        fun.executeStatement(sage, sql, function(error, results) {
            res.send(results)
        })
        
})

app.post('/sage_em', (req, res) => {
    let emp = JSON.parse(req.body.em_units)
    let codes = emp.map(s => s.stock_code)
    codes = JSON.stringify(codes).replace(/[\[\]]+/g, "").replace(/"/g, "'")
    let sql  = `SELECT StockLink, Code, Description_1, Re_Ord_Lvl, Re_Ord_Qty, Min_Lvl, Max_Lvl, AveUCst, LatUCst, LowUCst,
    HigUCst, StdUCst, Qty_On_Hand, ItemActive, ReservedQty, QtyOnPO, QtyOnSO, BomCode, JobQty FROM [StkItem] WHERE Code IN (${codes})`
    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    
  })

app.post('/sage_drivers', (req, res) => {
    let emp = JSON.parse(req.body.drivers)
    let codes = emp.map(s => s.code)
    codes = JSON.stringify(codes).replace(/[\[\]]+/g, "").replace(/"/g, "'")
    //console.log('codes = ', codes)
    let sql = `SELECT StockLink, Code, Description_1, Re_Ord_Lvl, Re_Ord_Qty, Min_Lvl, Max_Lvl, AveUCst, LatUCst, LowUCst,
    HigUCst, StdUCst, Qty_On_Hand, ItemActive, ReservedQty, QtyOnPO, QtyOnSO, BomCode, JobQty FROM [StkItem] WHERE Code IN (${codes})`
    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    

})

app.get('/stock_items', (req, res) => {
    let sql = `SELECT StockLink,ItemActive,(Code+' - '+Description_1) AS Code_Des,Code,Description_1,Description_2,
               Description_3,Qty_On_Hand,ReservedQty,AveUCst,LatUCst,LowUCst,HigUCst,StdUCst,ItemGroup
               FROM [StkItem] WHERE ItemActive = 1`

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
   
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








  module.exports = app

