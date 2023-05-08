const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()
const async = require('async');

const bcrypt = require('bcrypt');
const { Console } = require('console');
const { sendRealEmail } = require('../../functions/email');
const saltRounds = 10;

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

/********************* LOGIN *************************** */
app.post('/auth/login', (req, res) => {
    const params = req.body
    //console.log(params)
    //console.log('BE params = ', params)
    //bcrypt.compare(params.password, hash, function(err, result) {
    const sql = 'SELECT u.userId, u.name, u.surname, u.username, u.email, u.password, r.description AS role FROM users u JOIN roles r ON(u.roleId = r.roleId) WHERE username = ?  '; //and password = ? and status = "authorized"
  

        db.query(sql, [params.username], (err, result) => { //params.password
            //console.log('Selection result = ', result)
            
            //if (err) throw err;
            if (err) {
                console.log(err)
                res.json({type: 'ERROR', message: err.message})
                
            }

            if(result.length === 1)
            {
                let userObject = result[0] || {};
                //console.log('userObject = ', userObject)
                
                bcrypt.compare(params.password, result[0].password, function(errcrypt, rescrypt) {
                        //console.log('Bcrypt results = ', rescrypt)
                        if(rescrypt) {
                            console.log('Logged in!')
                            res.json({type: 'OK',message:'LoggedId',user: userObject});
                        }
                        else {
                            //console.log(errcrypt)
                            res.json({type: 'ERROR',message:'Wrong password',user: {}});
                            
                        }
                });
                /*
                if(userObject.hasOwnProperty('userId') && (Number(userObject.userId) >= 1))
                {
                    res.json({type: 'OK',message:'LoggedId',user: userObject});
                }else {
                    res.json({type: 'ERROR',message:'Invalid login',user: {}});
                } */
            } else {
                res.json({type: 'ERROR',message:'Invalid login',user: {}});
            } 
            
        });

    //});
    
});


app.get('/auth/user', function (req, res) {
    res.json({});
});



/************************* REGISTER ******************************** */

app.post('/reset_password', (req, res) => {
    const emp = req.body
    console.log('emp = ', emp)
    bcrypt.hash(emp.password, saltRounds, function(err, hash) {
        let sql = 'UPDATE users SET password = ? WHERE username = ?'
        db.query(sql, [hash, emp.username], (err, result) => {
            if(err) {
                console.log(err)
                res.json({type: 'ERROR', message: err.message})
            }
            else {
                res.send({type:'OK',message: 'Password succesfully changed', result: result});
            }
        })
    })
})

app.post('/register', (req, res) => {
    const emp = req.body
    bcrypt.hash(emp.password, saltRounds, function(err, hash) {
    
    let query = 'INSERT INTO users (roleId, username, name, surname, password, email, status) VALUES ?';
    let msg = 'Please authorize new user';
    let values = [
        [
        2,
        emp.username,
        emp.name,
        emp.surname,
        hash, //emp.password,
        emp.email,
        'authorized']
    ];

    
    db.query(query,[values], (err, result) => {
        if (err) {
            //console.log('err',err);
            let response = {type:'ERROR',message: err.message};
            if(err.hasOwnProperty('code'))
            {
                if(err.code == 'ER_DUP_ENTRY')
                {
                    response.message = 'The username has been taken';
                }
            }
            res.send(response);
        } 
        else {
            // Send Auth email
            res.send({type:'OK',message: 'Ok',result: result});
            mailOptions.to = 'kenneth@regentlight.co.za'
            mailOptions.subject = `Authorize ${emp.name} ${emp.surname}`
            //mailOptions.text = `Hi ${data2[0].person}, please find test results for ${data2[0].product_name} attached.`
            //mailOptions.attachments[0].path = ''
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
});
    
})

app.post('/authorize', (req, res) => { //update_priority
    const emp = req.body;
    const sql = "UPDATE users SET status = 'authorized', roleId = ? WHERE userId = ?";

    db.query(sql, [emp.role, emp.userId], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({ type: 'ERROR', message: err.message })

        }
        mailOptions.to = emp.email
        mailOptions.subject = 'Tech-System - User Authorized'
        mailOptions.text = `Hi ${emp.name}, you have been authorized to use tech-system. You can now login at http://it-foundry:3500/login \n \n**Please do not respond to this auto-generated message`
        
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
    res.send(result);
    });
})





app.post('/reset_email', (req, res) => {
    let email = req.body.email
    if(email) {
        email = email.trim()
    }
    console.log('email = ', email)
    async.waterfall([
        function(callback) {
            const sql = "SELECT * FROM users WHERE email = ?";
        
            db.query(sql, [email], (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({type: 'ERROR', message: err.message})
                    callback(err.message, null)
                }
                else {
                callback(null, result)
                }
            })
        },
        function(data, callback) {
            console.log('data = ', data)
            data = JSON.parse(JSON.stringify(data))
            if(data.length < 1) {
                res.json({type: 'ERROR', message: 'No user with provided email address has been found, please make sure you have typed the email correctly'}) 
            }
            else {
                data = data[0]
                console.log('data = ', data)
                let hash = Math.random().toString(20).substring(2, 15)
                let sql = "INSERT INTO password_reset (username, hash) VALUES ?"

                let values = [
                    [
                        data.username,
                        hash
                    ]
                ]

                db.query(sql, [values], (err, result) => {
                    if(err) {
                        console.log(err)
                    }
                    
                    else {
                        res.send(data)
                        let link = `http://localhost:3000/password-reset?hash=${hash}`
                        mailOptions.to = data.email
                        mailOptions.subject = 'Tech-System Password Reset'
                        mailOptions.text = `Hi ${data.name},\n\n Here is your password reset link: ${link}\n\n Please note that the above link expires within 1-day.`
                        mailOptions.attachments = ''
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
                                //res.send(data);
                            
                        
                        });*/
                    }

                })
                
            }
            
        }

    ])

})

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users WHERE status = 'not authorized'";

    db.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/all_users', (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/responsible_users', (req, res) => {
    const sql = "SELECT * FROM users WHERE responsible = 1 ORDER BY name";

    db.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/password_reset/:hash', function (req, res) {
    let emp = req.params
    console.log('emp = ', emp)
    let sql = 'SELECT * from password_reset WHERE hash = ?'
    //res.end()
    db.query(sql, [emp.hash], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
  })

  module.exports = app


