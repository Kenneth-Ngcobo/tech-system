const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'techsystem.regent@gmail.com',
      pass: 'cvqhkmtweqxxogis'
    }
  });
  


module.exports = {

    sendRealEmail(mailOptions) {
        mailOptions.from = 'techsystem.regent@gmail.com',

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                
            } 
                mailOptions = {}
            
        
        });

    },

    sendNotification(to, subject, attachments, body) {
        let mailOptions = {
            from: 'techsystem.regent@gmail.com',
        };
        mailOptions.to = to
        mailOptions.subject = subject
        mailOptions.attachments = attachments
        mailOptions.body = body + `\n\nKind Regards\nTech-System (no-reply)`
    },


    sendEmail(mailOptions, ncr, ncr_no, attachments, email_qty, email_components, email_failure) {
        mailOptions.to = ncr.email
        mailOptions.subject = `${ncr_no} Has Been Assigned To You`
        mailOptions.text = `Hi ${ncr.responsible2},\n`
        mailOptions.attachments = attachments
        mailOptions.html = '<!DOCTYPE html>'+
        '<html><head><title>Appointment</title>'+
        '</head><body><div>'+
        `Hi ${ncr.responsible2}`+
        '<br>'+
        '<br>'+
        `http://localhost:3000/ncr/${ncr_no}`+
        '<br>'+
        '<br>'+
        '<table border="1" style="border-collapse:collapse; width:50%">'+
            '<thead >'+
                '<th >Parameter</th>'+
                '<th >Value</th>'+
            '</thead>'+
            '<tbody >'+
                '<tr >'+
                    '<td><b>Type</b></td>'+
                    `<td> ${ncr.type}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Product</b></td>'+
                    `<td> ${ncr.product}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Qty</b></td>'+
                    `<td> ${email_qty}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Components</b></td>'+
                    `<td> ${email_components}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Failure</b></td>'+
                    `<td> ${email_failure}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>SO</b></td>'+
                    `<td> ${ncr.so}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Project/Site</b></td>'+
                    `<td> ${ncr.project}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Region</b></td>'+
                    `<td> ${ncr.region}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Logged By</b></td>'+
                    `<td> ${ncr.logged_by}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Responsible</b></td>'+
                    `<td> ${ncr.responsible2}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Due</b></td>'+
                    `<td> ${ncr.due_date}</td>`+
                '</tr>'+
            '</tbody >'+
        '<table>'+
        '</div></body></html>'
   
        mailOptions.body = `\n\nKind Regards\nTech-System (no-replay)`
   
        //mailOptions.attachments = ''
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                
            } 
                //console.log('Email sent: ' + info.response);
                mailOptions.to = ''
                mailOptions.subject = ''
                mailOptions.text = ''
                mailOptions.html = ''
                mailOptions.attachments = ''
                //res.send(data);
            
        
        });
   
   }
}