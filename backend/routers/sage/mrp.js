const { Router } = require('express')
const sage = require('../../databases/sage')
var fun = require('../../functions/functions')
const app = Router()

app.get('/bins', (req, res) => {
    let sql = `SELECT idBinLocation, cBinLocationName, cBinLocationDescription FROM [_btblBINLocation]`

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })

})

app.post('/sos', (req, res) => {
    let emp = req.body
    //console.log(emp)
    let sql  = `SELECT idInvoiceLines, H.OrderNum, H.OrderDate, H.DueDate, I.Code, I.iBinLocationID, cDescription, fQuantity
    FROM [_btblInvoiceLines] IL
    FULL JOIN [StkItem] I ON IL.iStockCodeID = I.StockLink
    FULL JOIN [InvNum] H ON H.AutoIndex = IL.iInvoiceID
    WHERE I.iBinLocationID >= '${emp.from_bin}' AND I.iBinLocationID <= '${emp.to_bin}' AND H.OrderDate >= '${emp.from}' AND H.OrderDate <= '${emp.to}'`
    console.log(sql)

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })
    
})

app.post('/ordered_fitting', (req, res) => {
    let emp = req.body
    let sql = `SELECT [idInvoiceLines]
    ,[iInvoiceID]
    ,H.OrderNum
    ,H.DocState
    ,R.Name AS Rep
    ,P.ProjectName
    ,H.DueDate
    ,H.OrderStatusID
    ,[iOrigLineID]
    ,[iGrvLineID]
    ,[iLineDocketMode]
    ,I.Code
    ,[cDescription]
    ,[iUnitsOfMeasureStockingID]
    ,[iUnitsOfMeasureCategoryID]
    ,[iUnitsOfMeasureID]
    ,[fQuantity]
    ,[fQtyChange]
    ,[fQtyToProcess]
    ,[fQtyLastProcess]
    ,[fQtyProcessed]
    ,[fQtyReserved]
    ,[fQtyReservedChange]
    ,[cLineNotes]
    ,[fUnitPriceExcl]
    ,[fUnitPriceIncl]
    ,[iUnitPriceOverrideReasonID]
    ,[fUnitCost]
    ,[fLineDiscount]
    ,[iLineDiscountReasonID]
    ,[iReturnReasonID]
    ,[fTaxRate]
    ,[bIsSerialItem]
    ,[bIsWhseItem]
    ,[fAddCost]
    ,[cTradeinItem]
    ,[iStockCodeID]
    ,[iJobID]
    ,[iWarehouseID]
    ,[iTaxTypeID]
    ,[iPriceListNameID]
    ,[fQuantityLineTotIncl]
    ,[fQuantityLineTotExcl]
    ,[fQuantityLineTotInclNoDisc]
    ,[fQuantityLineTotExclNoDisc]
    ,[fQuantityLineTaxAmount]
    ,[fQuantityLineTaxAmountNoDisc]
    ,[fQtyChangeLineTotIncl]
    ,[fQtyChangeLineTotExcl]
    ,[fQtyChangeLineTotInclNoDisc]
    ,[fQtyChangeLineTotExclNoDisc]
    ,[fQtyChangeLineTaxAmount]
    ,[fQtyChangeLineTaxAmountNoDisc]
    ,[fQtyToProcessLineTotIncl]
    ,[fQtyToProcessLineTotExcl]
    ,[fQtyToProcessLineTotInclNoDisc]
    ,[fQtyToProcessLineTotExclNoDisc]
    ,[fQtyToProcessLineTaxAmount]
    ,[fQtyToProcessLineTaxAmountNoDisc]
    ,[fQtyLastProcessLineTotIncl]
    ,[fQtyLastProcessLineTotExcl]
    ,[fQtyLastProcessLineTotInclNoDisc]
    ,[fQtyLastProcessLineTotExclNoDisc]
    ,[fQtyLastProcessLineTaxAmount]
    ,[fQtyLastProcessLineTaxAmountNoDisc]
    ,[fQtyProcessedLineTotIncl]
    ,[fQtyProcessedLineTotExcl]
    ,[fQtyProcessedLineTotInclNoDisc]
    ,[fQtyProcessedLineTotExclNoDisc]
    ,[fQtyProcessedLineTaxAmount]
    ,[fQtyProcessedLineTaxAmountNoDisc]
    ,[fUnitPriceExclForeign]
    ,[fUnitPriceInclForeign]
    ,[fUnitCostForeign]
    ,[fAddCostForeign]
    ,[fQuantityLineTotInclForeign]
    ,[fQuantityLineTotExclForeign]
    ,[fQuantityLineTotInclNoDiscForeign]
    ,[fQuantityLineTotExclNoDiscForeign]
    ,[fQuantityLineTaxAmountForeign]
    ,[fQuantityLineTaxAmountNoDiscForeign]
    ,[fQtyChangeLineTotInclForeign]
    ,[fQtyChangeLineTotExclForeign]
    ,[fQtyChangeLineTotInclNoDiscForeign]
    ,[fQtyChangeLineTotExclNoDiscForeign]
    ,[fQtyChangeLineTaxAmountForeign]
    ,[fQtyChangeLineTaxAmountNoDiscForeign]
    ,[fQtyToProcessLineTotInclForeign]
    ,[fQtyToProcessLineTotExclForeign]
    ,[fQtyToProcessLineTotInclNoDiscForeign]
    ,[fQtyToProcessLineTotExclNoDiscForeign]
    ,[fQtyToProcessLineTaxAmountForeign]
    ,[fQtyToProcessLineTaxAmountNoDiscForeign]
    ,[fQtyLastProcessLineTotInclForeign]
    ,[fQtyLastProcessLineTotExclForeign]
    ,[fQtyLastProcessLineTotInclNoDiscForeign]
    ,[fQtyLastProcessLineTotExclNoDiscForeign]
    ,[fQtyLastProcessLineTaxAmountForeign]
    ,[fQtyLastProcessLineTaxAmountNoDiscForeign]
    ,[fQtyProcessedLineTotInclForeign]
    ,[fQtyProcessedLineTotExclForeign]
    ,[fQtyProcessedLineTotInclNoDiscForeign]
    ,[fQtyProcessedLineTotExclNoDiscForeign]
    ,[fQtyProcessedLineTaxAmountForeign]
    ,[fQtyProcessedLineTaxAmountNoDiscForeign]
    ,[iLineRepID]
    ,[iLineProjectID]
    ,[iLedgerAccountID]
    ,[iModule]
    ,[bChargeCom]
    ,[bIsLotItem]
    ,[iLotID]
    ,[cLotNumber]
    ,[dLotExpiryDate]
    ,[iMFPID]
    ,[iLineID]
    ,[iLinkedLineID]
    ,[fQtyLinkedUsed]
    ,[fUnitPriceInclOrig]
    ,[fUnitPriceExclOrig]
    ,[fUnitPriceInclForeignOrig]
    ,[fUnitPriceExclForeignOrig]
    ,[iDeliveryMethodID]
    ,[fQtyDeliver]
    ,[dDeliveryDate]
    ,[iDeliveryStatus]
    ,[fQtyForDelivery]
    ,[bPromotionApplied]
    ,[fPromotionPriceExcl]
    ,[fPromotionPriceIncl]
    ,[cPromotionCode]
    ,[iSOLinkedPOLineID]
    ,[fLength]
    ,[fWidth]
    ,[fHeight]
    ,[iPieces]
    ,[iPiecesToProcess]
    ,[iPiecesLastProcess]
    ,[iPiecesProcessed]
    ,[iPiecesReserved]
    ,[iPiecesDeliver]
    ,[iPiecesForDelivery]
    ,[fQuantityUR]
    ,[fQtyChangeUR]
    ,[fQtyToProcessUR]
    ,[fQtyLastProcessUR]
    ,[fQtyProcessedUR]
    ,[fQtyReservedUR]
    ,[fQtyReservedChangeUR]
    ,[fQtyDeliverUR]
    ,[fQtyForDeliveryUR]
    ,[fQtyLinkedUsedUR]
    ,[iPiecesLinkedUsed]
    ,[iSalesWhseID]
    ,[_btblInvoiceLines_iBranchID]
    ,[_btblInvoiceLines_dCreatedDate]
    ,[_btblInvoiceLines_dModifiedDate]
    ,[_btblInvoiceLines_iCreatedBranchID]
    ,[_btblInvoiceLines_iModifiedBranchID]
    ,[_btblInvoiceLines_iCreatedAgentID]
    ,[_btblInvoiceLines_iModifiedAgentID]
    ,[_btblInvoiceLines_iChangeSetID]
    ,[_btblInvoiceLines_Checksum]
    ,[bReverseChargeApplied]
    ,[fRecommendedRetailPrice]
    FROM [_btblInvoiceLines] IL
    FULL JOIN [StkItem] I ON IL.iStockCodeID = I.StockLink
    FULL JOIN [InvNum] H ON H.AutoIndex = IL.iInvoiceID
    FULL JOIN [SalesRep] R ON R.idSalesRep = H.DocRepID
    FULL JOIN [Project] P ON P.ProjectLink = H.ProjectID
    WHERE I.iBinLocationID = '${emp.from_bin}' 
    AND H.DueDate >= '${emp.from}' AND H.DueDate <= '${emp.to}'
    ORDER BY DueDate`

    console.log(sql)

    fun.executeStatement(sage, sql, function(error, results) {
        res.send(results)
    })

})

module.exports = app