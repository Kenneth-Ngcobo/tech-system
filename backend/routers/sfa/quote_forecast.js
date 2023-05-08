const { Router } = require('express')
const sfa = require('../../databases/sfa')
const async = require('async');

const app = Router()

app.get('/range', async function (req, res) {
    let sql = "Select * from nRange ORDER BY RangeDescription"

    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        res.send(result.recordset)
    
    })
   
});

app.get('/project_status', function (req, res) {

    let sql = "Select * from ProjectStatus"

    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        res.send(result.recordset)
    
    })

});

app.get('/quote_status', function (req, res) {

    let sql = "Select * from QuotationStatus"

    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        res.send(result.recordset)
    
    })
    
});

app.get('/sfa_fittings', function (req, res) {

    let sql = "Select nFittingID, nRangeID, FittingName, FittingCode from nFitting"
    
    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        // send records as a response
        //console.log('result = ', result)
        res.send(result.recordset)
    
    })
    
});

app.get('/sfa_reps', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = `SELECT E.EmployeeID, (E.name + ' ' + E.Surname) as Name FROM Employee E 
                JOIN EmployeeTypeLink EL ON EL.EmployeeID = E.EmployeeID
                JOIN EmployeeType ET ON ET.EmployeeTypeID = EL.EmployeeTypeID
                WHERE ET.EmployeeTypeID = 1 AND E.Deleted = 0 ORDER BY Name`;
    
    /*executeStatement(sql, function(error, results) {
        res.send(results)
    })*/
    sfa.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result.recordset);
    });
   
});

app.post('/quotes', function (req, res) {

    let emp = req.body
    console.log('req.body = ', req.body)
    let sql = ''
   

    sql = `SELECT * FROM [RegentSales].[dbo].[v_ProjectQuotes] t1
            WHERE t1.Version = 
            (SELECT max(Version) FROM [RegentSales].[dbo].[Quotation] t2 WHERE t2.QuotationKey = t1.QuotationKey AND QuotationStatusID IN ('6','9') 
            AND UseToEstimate = 1 AND ExpectedOrderDate >= ${"'"+emp.from+"'"} AND ExpectedOrderDate <= ${"'"+emp.to+"'"})
            AND FittingCode = ${"'"+emp.fitting+"'"}
            ORDER BY QuotationID`
    
    
    console.log(sql)
   

    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        // send records as a response
        res.send(result.recordset)
    
    })
    
});


app.post('/fitting_count', (req, res) => {
    let emp = req.body
    let sql = ""

   
    if(emp.fitting == 'All' && emp.range == 0) { //PERFECT
        console.log('Select everything')

        
        sql = `SELECT Q.FittingCode, MAX(F.FittingName) AS FittingName, MAX(Q.Quantity) AS Quantity, MAX(F.nRangeID) AS nRangeID, MAX(R.RangeDescription) AS RangeDescription FROM
                (SELECT MAX(FittingCode) AS FittingCode, SUM(Quantity) AS Quantity FROM [RegentSales].[dbo].[v_ProjectQuotes] t1
                WHERE t1.Version = 
                (SELECT max(Version) FROM [RegentSales].[dbo].[Quotation] t2 WHERE t2.QuotationKey = t1.QuotationKey AND QuotationStatusID IN ('6','9') 
                AND UseToEstimate = 1 AND ExpectedOrderDate >= ${"'"+emp.from+"'"} AND ExpectedOrderDate <= ${"'"+emp.to+"'"})
                GROUP BY FittingCode) Q
                JOIN nFitting F ON F.FittingCode = Q.FittingCode
                JOIN nRange R ON R.nRangeID = F.nRangeID
                GROUP BY Q.FittingCode
                ORDER BY Quantity DESC`
    }

    if( (emp.fitting != 'All' && emp.range != 0) || (emp.fitting != 'All' && emp.range == 0) ) { //PERFECT, SELECT SPECIFIC FITTING
        console.log('Select specific fitting with or without range')

       
        
        sql = `SELECT Q.FittingCode, MAX(F.FittingName) AS FittingName, MAX(Q.Quantity) AS Quantity, MAX(F.nRangeID) AS nRangeID, MAX(R.RangeDescription) AS RangeDescription FROM
                (SELECT MAX(FittingCode) AS FittingCode, SUM(Quantity) AS Quantity FROM [RegentSales].[dbo].[v_ProjectQuotes] t1
                WHERE t1.Version = 
                (SELECT max(Version) FROM [RegentSales].[dbo].[Quotation] t2 WHERE t2.QuotationKey = t1.QuotationKey AND QuotationStatusID IN ('6','9') 
                AND UseToEstimate = 1 AND ExpectedOrderDate >= ${"'"+emp.from+"'"} AND ExpectedOrderDate <= ${"'"+emp.to+"'"})
                GROUP BY FittingCode) Q
                JOIN nFitting F ON F.FittingCode = Q.FittingCode
                JOIN nRange R ON R.nRangeID = F.nRangeID
                WHERE Q.FittingCode = ${"'"+emp.fitting+"'"}
                GROUP BY Q.FittingCode
                ORDER BY Quantity DESC`
    }


    if(emp.fitting == 'All' && emp.range != 0) { //TRICKY
        console.log('Select range count')


        sql = `SELECT Q.FittingCode, MAX(F.FittingName) AS FittingName, MAX(Q.Quantity) AS Quantity, MAX(F.nRangeID) AS nRangeID, MAX(R.RangeDescription) AS RangeDescription FROM
                (SELECT MAX(FittingCode) AS FittingCode, SUM(Quantity) AS Quantity FROM [RegentSales].[dbo].[v_ProjectQuotes] t1
                WHERE t1.Version = 
                (SELECT max(Version) FROM [RegentSales].[dbo].[Quotation] t2 WHERE t2.QuotationKey = t1.QuotationKey AND QuotationStatusID IN ('6','9') 
                AND UseToEstimate = 1 AND ExpectedOrderDate >= ${"'"+emp.from+"'"} AND ExpectedOrderDate <= ${"'"+emp.to+"'"})
                GROUP BY FittingCode) Q
                JOIN nFitting F ON F.FittingCode = Q.FittingCode
                JOIN nRange R ON R.nRangeID = F.nRangeID
                WHERE F.nRangeID = ${emp.range}
                GROUP BY Q.FittingCode
                ORDER BY Quantity DESC`
    }

       
   
    console.log('fitting count sql = ', sql)
    
       
    sfa.query(sql, function (err, result) {
            
        if (err) console.log(err)

        res.send(result.recordset)
    
    })

})

module.exports = app
