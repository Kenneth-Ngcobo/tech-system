const express = require('express');
const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()
const { sendRealEmail } = require('../../functions/email');
const upload = require('../../storage/storage')



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




app.get('/testing', function (req, res) {
    let sql = 'SELECT * from testing WHERE active = 1 order by test_date DESC'
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
  })

  app.post('/testing', function (req, res) { 
    let emp = req.body
    console.log('emp = ', emp)
    let sql = 'INSERT INTO testing (product_name, length, board, led, cct, led_bin, wattage, current, lens_cover, reason, priority, test, date_required, person, email) VALUES ?'
    let values = [
      [
        emp.product_name,
        emp.length,
        emp.board,
        emp.led,
        emp.cct,
        emp.led_bin,
        emp.wattage,
        emp.current,
        emp.lens_cover,
        emp.reason,
        emp.priority,
        emp.test,
        emp.date_required,
        emp.person,
        emp.email
      ]
    ]
    db.query(sql, [values], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
          
          console.log('result2 = ', JSON.parse(JSON.stringify(result)))
          let test_no = JSON.parse(JSON.stringify(result)).insertId
          res.send(result)
          let text = ''
          if(emp.test == 'Thermal' || emp.test == 'Electrical' || emp.test == 'IP') {
              mailOptions.to = 'nk.fuze@gmail.com' //lindo@wahl.co.za
             
          }
          if(emp.test == 'Photometric') {
              mailOptions.to = 'nk.fuze@gmail.com' //Moses.N@Regentlight.co.za
              
          }
          if(emp.test == 'Dummy') {
            mailOptions.to = 'nk.fuze@gmail.com' //Moses.N@Regentlight.co.za
            
          }
          mailOptions.subject = `Test No: ${test_no} Request - ${emp.product_name} By ${emp.person}`
          mailOptions.text =  `Test Information: \n`
          mailOptions.html = '<!DOCTYPE html>'+
          '<html><head><title>Appointment</title>'+
          '</head><body><div>'+
          `${text}`+
          '<table border="1" style="border-collapse:collapse; width:50%">'+
              '<thead >'+
                  '<th >Parameter</th>'+
                  '<th >Value</th>'+
              '</thead>'+
              '<tbody >'+
                  '<tr >'+
                      '<td><b>Test No.</b></td>'+
                      `<td> ${test_no}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>Test Type</b></td>'+
                      `<td> ${emp.test}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>Product Name</b></td>'+
                      `<td> ${emp.product_name}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>Reason for Test</b></td>'+
                      `<td> ${emp.reason}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>Wattage</b></td>'+
                      `<td> ${emp.wattage}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>Current</b></td>'+
                      `<td> ${emp.current}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>CCT</b></td>'+
                      `<td> ${emp.cct}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>Board</b></td>'+
                      `<td> ${emp.board}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>LED</b></td>'+
                      `<td> ${emp.led}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>Lens / Cover</b></td>'+
                      `<td> ${emp.lens_cover}</td>`+  
                  '</tr>'+
                  '<tr>'+
                      '<td><b>LED Bin</b></td>'+
                      `<td> ${emp.led_bin}</td>`+
                  '</tr>'+
                  '<tr >'+
                      '<td><b>Required On</b></td>'+
                      `<td> ${emp.date_required}</td>`+
                  '</tr>'+
              '</tbody>'+
          '</table>'+
          '</div></body></html>'

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
            
        }
    })
  })
  
  app.post('/upload', upload.fields([{name: 'file', maxCount: 1}, {name: 'ies', maxCount: 1}]), function (req, res) { //upload.fields([{name: 'file', maxCount: 1}, {name: 'ies', maxCount: 1}])
      console.log('upload endpoint')
      let sql = "UPDATE testing set report = ?, ies = ? WHERE id = ?"
      let files = JSON.parse(JSON.stringify(req.files))
      let params = JSON.parse(JSON.stringify(req.body))
      console.log('params = ', params)
      let file = params.orig_file
      if(files.file) {
          file = files.file[0].filename
          
      }
      let ies = params.orig_ies
      if(files.ies) {
          ies = files.ies[0].filename
      }
      let id = params.id
      console.log('id = ', id)
      console.log('files = ', files)
      db.query(sql, [file, ies, req.body.id], (err, result) => {
          if(err) {
              console.log(err)
          }
          else {
              res.end()
          }
      })
      res.end()
      
  })
  
  app.post('/modify_test', upload.fields([{name: 'file', maxCount: 1}, {name: 'ies', maxCount: 1}]), function (req, res) { // upload.single("file"),
      console.log('req.body = ', req.body)
  
      let emp = JSON.parse(JSON.stringify(req.body))
      let files = JSON.parse(JSON.stringify(req.files))
      console.log('emp = ', emp)
      console.log('files = ', files)
      console.log('files.file = ', files.file[0])
      if(files.ies) {
          console.log('files.ies = ', files.ies[0])
      }
      else {
          console.log('file.ies = ', files.ies)
      }
      
      //console.log('emp.status = ', emp.status)
      let sql = "UPDATE testing SET status = ?, pass = ?, test_comments = ?, report = ?, ies = ?, test_date = ? WHERE id = ?";
     
      let report = null
      if(files.file) {
          report = files.file[0].filename
          mailOptions.attachments = [{ path: 'uploads/'+ report}] //http://it-foundry:3001/uploads/
      }
  
      let ies = null
      if(files.ies) {
          ies = files.ies[0].filename
          mailOptions.attachments = [{ path: 'uploads/'+ report},{ path: 'uploads/'+ ies}] //http://it-foundry:3001/uploads/
      }
          
      db.query(sql, [emp.status,emp.pass,emp.test_comments,report,ies,emp.test_date, emp.id], (err, result) => {
          if(err) {
              console.log(err)
          }
          else {
              res.send(result);
              mailOptions.to = 'kenneth@regentlight.co.za' // , welcome.m@regentlight.co.za
              mailOptions.subject = emp.product_name+' Approve Test!'
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
          }
      })
      
      
    })
  
    app.post('/approve', (req, res) => {
      const emp = req.body;
      console.log('emp = ', emp)
      console.log('approved_by = ', emp.approved_by)
      const sql = `UPDATE testing SET approved = ?, approved_by = ?, rejection_reason = ? WHERE id = ?`;
      //console.log(sql)
      //console.log('Remove IDORDERED_BOMS: ', req.body.idordered_boms)
  
      db.query(sql, [emp.approved, emp.approved_by, emp.rejection_reason, emp.id], (err, result) => {
          //if (err) throw err;
          if (err) {
              console.log(err)
              res.json({type: 'ERROR', message: err.message})
              
          }
          else {
              if(emp.approved == 'YES') {
  
                  if(emp.test == 'Photometric') {
                      mailOptions.attachments = [{ path: 'uploads/'+ emp.report}, { path: 'uploads/'+ emp.ies}] //http://it-foundry:3001/uploads/
                  }
                  else {
                      mailOptions.attachments = [{ path: 'uploads/'+ emp.report}] //http://it-foundry:3001/uploads/
                  }
  
                  mailOptions.to = emp.email
                  mailOptions.subject = emp.product_name+' Test Completed!'
                  mailOptions.text = `Hi ${emp.person}, please find test results for ${emp.product_name} attached.`
                  //mailOptions.attachments = [{ path: 'uploads/'+ emp.report}, { path: 'uploads/'+ emp.ies}] //http://it-foundry:3001/uploads/
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
                          res.send(result);
                      
                  
                  });*/
              }
              else {
                  if(emp.test == 'Thermal' || emp.test == 'Electrical' || emp.test == 'IP') {
                      mailOptions.to = `nk.fuze@gmail.com, ${emp.email}` //lindo@wahl.co.za
                     
                  }
                  if(emp.test == 'Photometric') {
                      mailOptions.to = `nk.fuze@gmail.com, ${emp.email}` //Moses.N@Regentlight.co.za
                  }
                  mailOptions.subject = `${emp.product_name} Test Rejected`
                  mailOptions.text =  emp.rejection_reason
                  mailOptions.attachments = [{ path: 'http://it-foundry:3001/uploads/'+ emp.report}]
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
  
              }
              res.send(result);
          }
          
      })
  })
  
  app.post('/modify_test_details', (req, res) => {
      //const emp = req.body;
      //console.log(emp)
      //const sql = `UPDATE testing SET ${emp.column} = ? WHERE id = ?`;
      //console.log(sql)
      //console.log('Remove IDORDERED_BOMS: ', req.body.idordered_boms)
      const emp = req.body;
      console.log('emp = ', emp)
      let keys = Object.keys(emp)
      let length = Object.keys(emp).length
      let email_body = ''
      let product_name = emp.product_name
      let test = emp.test
      let updated_by = emp.updated_by
    
      /*delete emp['product_name']
      delete emp['test']
      delete emp['updated_by']*/
      
      let sql = "UPDATE testing SET ";
      console.log('time-zones: ', new Date().toLocaleString())
      
      for(let i = 0; i<length; i++) {
          console.log(`${keys[i]} = ${emp[keys[i]]}`)
          
          if(i<length-2) {
              sql = sql + `${keys[i]} = ${JSON.stringify(emp[keys[i]])}` + ', '
              email_body = email_body + ` ${keys[i]} : ${emp[keys[i]]} \n`
          }
          if(i == length-1) {
              sql = sql + `${keys[i-1]} = ${JSON.stringify(emp[keys[i-1]])}, modified = ${JSON.stringify(new Date().toLocaleString().slice(0, 19).replace('T', ' '))} WHERE id = ${emp[keys[i]]}`
              email_body = email_body + ` ${keys[i-1]} : ${emp[keys[i-1]]}`
          }
      }
  
     
      console.log('sql = ', sql)
      //res.end()
  
      db.query(sql, (err, result) => {
          //if (err) throw err;
          if (err) {
              console.log(err)
              res.json({type: 'ERROR', message: err.message})
              
          }
          res.send(result);
          if(test == 'Thermal' || test == 'Electrical' || test == 'IP') {
              mailOptions.to = `nk.fuze@gmail.com, ${emp.email}` //lindo@wahl.co.za
             
          }
          if(test == 'Photometric') {
              mailOptions.to = `nk.fuze@gmail.com, ${emp.email}` //Moses.N@Regentlight.co.za
          }
          mailOptions.subject = `${product_name} Test Updated By ${updated_by}`
          mailOptions.text = email_body
          //console.log('typeOf mailOptions.to = ', typeof mailOptions.to)
          if(mailOptions.to.length > 0) {
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
          }
          
      })
  })

  app.post('/update_priority', (req, res) => { //delete_test
    const emp = req.body;
    const sql = "UPDATE testing SET priority = ? WHERE id = ?";

    db.query(sql, [emp.priority, emp.id], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({ type: 'ERROR', message: err.message })

        }
        res.send(result);
     
        
    });
});

app.post('/update_notifier', (req, res) => {
    let emp = req.body
    if(emp.test == 'Photometric') {
        mailOptions.to = 'nk.fuze@gmail.com' //Moses.N@Regentlight.co.za
    }
    if(emp.test == 'Thermal' || emp.test == 'Electrical' || emp.test == 'IP') {
        mailOptions.to = 'nk.fuze@gmail.com' //lindo@wahl.co.za
    }
    
    mailOptions.subject = `Test Priority Change! ${emp.product_name}`
    mailOptions.text = `Please note that ${emp.person} has changed the test priority \n \n Visit http://it-foundry:3500/testing to see the updated schedule`
    
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
        res.end();
    
   
    });*/

})

app.post('/delete_test', (req, res) => { //
    const emp = req.body;
    const sql = "UPDATE testing SET active = 0 WHERE id = ?";

    db.query(sql, [emp.id], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({ type: 'ERROR', message: err.message })

        }
        res.send(result);
    });
});

module.exports = app