const { Router } = require('express')
const db = require('../../databases/tech')
const fs = require('fs');
const { sendRealEmail } = require('../../functions/email')
const app = Router()

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var mailOptions = {
    from: 'techsystem.regent@gmail.com',
    to: '',
    subject: '',
    /*attachments: [{
        //path: ''
    }],*/
    text: ''
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/codes', (req, res) => {
    emp = req.body
    //console.log('codes emp = ', emp)
    let sql = ''
    if(emp.id != undefined) {
        quote_no = emp.id
        sql = `SELECT * FROM quote_codes WHERE project_id = ${emp.id}`
    }
    if(emp.no != undefined) {
        quote_no = emp.no
        sql = `SELECT * FROM quote_codes WHERE quote_no = ${emp.no}`
    }
    

    db.query(sql, (err, results) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(results)
        }
       
    })

})

app.post('/order_info', (req, res) => {
    emp = req.body
    let sfa_ref = emp.sfa_ref.replace('Q', '')
    let sql = `SELECT * FROM order_info WHERE sfa_ref LIKE '%${sfa_ref}%'`
    db.query(sql, (err, results) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(results)
        }
    })
})

app.post('/save_order_info', (req, res) => {
    let changes = req.body
    console.log('changes = ', changes)
    if(changes.action == 'add') {
        sql = 'INSERT INTO order_info (sfa_ref, doc_type, ext_ordernum, rep, project_code, client, priority, person, email, processed, date) VALUES ?'
        //console.log('save_quote sql = ', sql)
        let values = [
            [
                changes.sfa_ref,
                changes.doc_type,
                changes.ext_ordernum,
                changes.rep,
                changes.project_code,
                changes.client,
                changes.priority,
                changes.person,
                changes.email,
                changes.processed,
                changes.date
                
            ]
        ]
        db.query(sql, [values], (err, results) => {
            if(err) {
                console.log(err)
            }
           
        })
    }
    if(changes.action == 'update') {
        delete changes['action']
        let keys = Object.keys(changes)
        let length = keys.length
        let sql = "UPDATE order_info SET "
        for(let i = 0; i<length; i++) {
            console.log(`${keys[i]} = ${changes[keys[i]]}`)
            if(i<length-2) {
                sql = sql + `${keys[i]} = ${JSON.stringify(changes[keys[i]])}` + ', '
            }
            if(i == length-1) {
                sql = sql + `${keys[i-1]} = ${JSON.stringify(changes[keys[i-1]])} WHERE sfa_ref = '${changes[keys[i]]}'`
            }
        }
      
       console.log('save_order_info sql = ', sql)
       db.query(sql, (err, results) => {
        if(err) {
            console.log(err)
        }
       
    })
    }      

    res.end()
})

app.post('/write_file', (req, res) => {
    let emp = req.body
    let data = emp.data
    //let data = JSON.parse(emp).data
    let path = "C:\\Users\\kenneth\\tech-system\\tech-system-backend\\sfadump\\" + data[0].QuoteNo + '.csv' //__basedir + '/sfadump/' + data[0].QuoteNo + '.csv' //QuoteNo
    let path2 = "C:\\Users\\kenneth\\tech-system\\tech-system-backend\\sfadump2\\" + data[0].QuoteNo + '.csv'  //__basedir + '/sfadump2/' + data[0].QuoteNo + '.csv'
    let path3 = "Z:\\Technical\\" + data[0].QuoteNo + '.csv'
    //console.log('emp = ', emp)
    //console.log('emp.data = ', emp.data)
    let csv = '';
    let header = Object.keys(data[0]).join(',');
    let values = data.map(o => Object.values(o).join(',')).join('\n');
    csv += header + '\n' + values;
    fs.writeFile(path, csv, 'utf-8', (err) => {
        if(err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
        }
        else {
            console.log('Success')
            res.json({type: 'SUCCESS', message: `Quote successfully exported, await email confirming your order placement`})
        }
    })
    fs.writeFile(path2, csv, 'utf-8', (err) => {
        if(err) {
            console.log(err)
            //res.json({type: 'ERROR', message: err.message})
        }
        else {
            console.log('Success')
            //res.json({type: 'SUCCESS', message: `Quote successfully exported, await email confirming your order placement`})
        }
    })
    //console.log('data = ', data)
    //res.end()
})







app.post('/save_quote', (req, res) => {
    let changes = JSON.parse(req.body.changes)
    console.log('changes = ', changes)
    for(let i = 0; i<changes.length; i++) {
        let sql = ""
        if(changes[i].action == 'add') {
            sql = 'INSERT INTO quote_codes (sfa_ref, code, item_id, project_id, quote_no, description, type, qty, warehouse, person, selected) VALUES ?'
            //console.log('save_quote sql = ', sql)
            let values = [
                [
                    changes[i].sfa_ref,
                    changes[i].Code,
                    changes[i].item_id,
                    changes[i].project_id,
                    changes[i].quote_no,
                    changes[i].description,
                    changes[i].type,
                    changes[i].qty,
                    changes[i].warehouse,
                    changes[i].person,
                    changes[i].selected
                ]
            ]
            db.query(sql, [values], (err, results) => {
                if(err) {
                    console.log(err)
                }
               
            })
        }
        if(changes[i].action == 'update') {
            sql = 'UPDATE quote_codes SET sfa_ref = ?, code = ?, item_id = ?, project_id = ?, quote_no = ?, description = ?, type = ?, qty = ?, warehouse = ?, person = ?, selected = ?, processed = ? WHERE id = ?' 
            console.log('save_quote sql = ', sql)
            db.query(sql, [changes[i].sfa_ref, changes[i].Code, changes[i].item_id, changes[i].project_id, changes[i].quote_no, changes[i].description, changes[i].type,changes[i].qty,changes[i].warehouse,changes[i].person,changes[i].selected,changes[i].processed,changes[i].id], (err, results) => {
                if(err) {
                    console.log(err)
                }
               
            })
        }      
       
    }
    //if(changes.length > 0) {
        let sql = `SELECT MAX(id) AS id FROM technical.order_info_audit;` //WHERE sfa_ref = '${changes[0].sfa_ref}'
        db.query(sql, (err, results) => {
            if(err) {
                console.log(err)
            }
            console.log('results = ', results)
            res.send(results)
        })
    //}
    /*else {
        res.end()
    }*/
    
    
})

app.post('/get_request', (req, res) => {
    emp = req.body
    let quote_no = ''
    if(emp.id != undefined) {
        quote_no = emp.id
    }
    if(emp.no != undefined) {
        quote_no = emp.no
    }
    let sql = `SELECT * FROM code_request WHERE quote_no = ${quote_no}`
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            console.log('request result = ', result)
            res.send(result)
        }
    })
})

app.post('/codes_created', (req, res) => {
    let emp = req.body
    let sql = `UPDATE code_request SET created_by = ?, date_created = ? WHERE id = ?`

    db.query(sql, [emp.created_by, new Date().toLocaleString()/*toISOString().slice(0, 19).replace('T', ' ')*/, emp.id], (err, result) => {
        if(err) {
            console.log(err)
        }
        res.end()

        mailOptions.to = `${emp.email}` // , welcome.m@regentlight.co.za
        mailOptions.subject = `Codes Created For ${emp.type}: ${emp.name}`
        mailOptions.text = ``
        //mailOptions.attachments = [{ path: 'http://it-foundry:3001/uploads/'+ report}]
        sendRealEmail(mailOptions)
        /*transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                
            } 
                //console.log('Email sent: ' + info.response);
                mailOptions.to = ''
                mailOptions.subject = ''
                mailOptions.text = ''
                mailOptions.html = ''
                mailOptions.attachments = ''
            
        });*/
    })
    
})


app.post('/request_codes', (req, res) => {
    let emp = req.body
    let sql = `INSERT INTO code_request (quote_no, requested_by, email, requested_from, date_requested) VALUES ?`

    let values = [
        [
            emp.quote_no,
            emp.requested_by,
            emp.email,
            emp.admin_email,
            new Date().toLocaleString() //toISOString().slice(0, 19).replace('T', ' ')

        ]
    ]

    db.query(sql, [values], (err, result) => {
        if(err) {
            console.log(err)
        }
        res.end()

        mailOptions.to = emp.admin_email // , welcome.m@regentlight.co.za
        mailOptions.subject = `Code Request For ${emp.type}: "${emp.name}" by ${emp.requested_by}`
        mailOptions.text = ``
        //mailOptions.attachments = [{ path: 'http://it-foundry:3001/uploads/'+ report}]
        sendRealEmail(mailOptions)
        /*transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                
            } 
                //console.log('Email sent: ' + info.response);
                mailOptions.to = ''
                mailOptions.subject = ''
                mailOptions.text = ''
                mailOptions.html = ''
                mailOptions.attachments = ''
            
        });*/
    })
  
})

app.get('/sales_reps', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = "SELECT * FROM sales_reps";

    db.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/order_status', (req, res) => {
    let sql = 'SELECT * FROM order_status'
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