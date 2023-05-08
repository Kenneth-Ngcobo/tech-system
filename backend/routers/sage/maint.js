const { Router } = require('express')
const sage = require('../../databases/sage')
var fun = require('../../functions/functions')
const app = Router()

app.post('/job_card', (req, res) => {
    let emp = req.body
    let sql = `SELECT idJCTxLines AS id,iStockID,iSupplierID,iLedgerID,IL.cDescription AS component,fTransQty AS qty,fUnitCost AS cost,fLineTotalCost AS total_cost
                FROM [_btblJCTxLines] IL
                FULL JOIN [_btblJCMaster] M on IL.iJCMasterID = M.IdJCMaster
                WHERE M.cOrderNo = '${emp.so}'`
    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
   
})




  app.get('/pastel_maint', (req, res) => {
    let sql = `SELECT I.AutoIndex
                ,I.OrderNum,I.ExtOrderNum,I2.InvDate, [ProjectName],Code,[Name], cAgentName
                ,Fitting = STUFF((
                    SELECT ',' + IL.cDescription
                FROM [_btblInvoiceLines] IL
                WHERE I.AutoIndex = IL.iInvoiceID
                FOR XML PATH('')), 1, 1, '')
                
                ,Qty = STUFF((
                        SELECT ',' + CAST(IL.fQuantity AS VARCHAR)
                    FROM [_btblInvoiceLines] IL
                    WHERE I.AutoIndex = IL.iInvoiceID
                    FOR XML PATH('')), 1, 1, '')
                    
                ,LineNote = REPLACE(STUFF((
                    SELECT ',' + IL.cLineNotes
                FROM [_btblInvoiceLines] IL
                WHERE I.AutoIndex = IL.iInvoiceID
                FOR XML PATH('')), 1, 1, ''), '&#x0D', '')
                
                ,I.DocState,I.AccountID,I.Description,I.OrderDate,I.DueDate,I.DeliveryDate,I.TaxInclusive,I.Email_Sent
                ,I.Address1,I.Address2,I.Address3,I.Address4,I.Address5,I.Address6,I.DocRepID,I.DeliveryNote,I.ProjectID,I.iLinkedDocID
                
                FROM [InvNum] I 
                FULL JOIN [InvNum] I2 ON I.ExtOrderNum = I2.InvNumber AND LEN(I.ExtOrderNum) > 0
                FULL JOIN [Project] P ON I.ProjectID = P.ProjectLink
                FULL JOIN [SalesRep] S ON I.DocRepID = S.idSalesRep
                FULL JOIN [_rtblAgents] A ON I.iINVNUMAgentID = A.idAgents
                WHERE I.cAccountName LIKE '%MAINTENANCE%' AND I.DocState = '1'
                ORDER BY AutoIndex DESC`

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    
})

module.exports = app