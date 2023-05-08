const { Router } = require('express')
const db = require('../../databases/tech')
const async = require('async');
const app = Router()
//const fs = require('fs');
const path = require('path');
const upload = require('../../storage/storage')


/*var multer = require('multer');

global.__basedir = __dirname;
let dir = 'C:\\Users\\kenneth\\tech-system\\tech-system-backend\\uploads' 

app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir)                    //cb(null, __basedir + '/uploads/')
  },
  filename: (req, file, cb) => {
     
      cb(null, (file.fieldname || 'test123') + "-" + Date.now() + "-" + (file.originalname || 'or1234'))
  }
});
console.log('ncr dirname = ', dir)
//console.log('ncr base url = ', dir)
//console.log('type of dir = ', typeof dir)
const upload = multer({ storage: storage });*/

var fun = require('../../functions/functions');
const { sendRealEmail } = require('../../functions/email');
const { sendEmail } = require('../../functions/email')


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



app.get('/ncr', (req, res) => {
    const sql = "SELECT * FROM ncr order by log_date DESC";

    db.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/joined_ncr', (req, res) => {
    const sql = "SELECT n.id, n.ncr_no, n.invoice_no, n.credit_no, n.so, n.orig_so, n.sales_rep, (n.value + n.comp_value) AS value, n.status, n.maint_status, CONCAT(n.department, n.project) AS site, n.region, n.type, n.so, n.project, n.reported_by, n.logged_by, n.log_date, n.manufactured, n.due_date, n.responsible, n.access, n.cost_elements,\
    GROUP_CONCAT(DISTINCT p.product_name ORDER BY p.id) AS product_name, GROUP_CONCAT(DISTINCT p.liable_entity ORDER BY p.id) AS liable_entity, GROUP_CONCAT(DISTINCT p.liable ORDER BY p.id) AS liable,  GROUP_CONCAT(p.qty ORDER BY p.id) AS p_qty, GROUP_CONCAT(DISTINCT p.category ORDER BY p.id SEPARATOR '/+/') AS category, GROUP_CONCAT(DISTINCT p.failure ORDER BY p.id SEPARATOR '/+/') AS failure, GROUP_CONCAT(DISTINCT p.findings ORDER BY p.id) AS findings, GROUP_CONCAT(DISTINCT p.corrective_action ORDER BY p.id) AS corrective_action, GROUP_CONCAT(DISTINCT p.preventative_action ORDER BY p.id) AS preventative_action, GROUP_CONCAT(DISTINCT p.liable ORDER BY p.id) AS liable, GROUP_CONCAT(DISTINCT p.images ORDER BY p.id) AS images, p.report, p.training_doc, p.training_reg, p.other, p.installation_man, p.drawings,\
    GROUP_CONCAT(c.component ORDER BY c.id) as component,  GROUP_CONCAT(c.qty ORDER BY c.id) AS c_qty,  GROUP_CONCAT(c.supplier ORDER BY c.id) AS supplier\
    FROM ((ncr n LEFT JOIN ncr_products p ON n.ncr_no = p.ncr_no) LEFT JOIN ncr_components c ON (c.ncr_no = p.ncr_no AND c.product = p.product_name))\
    WHERE n.active = 1\
    GROUP BY n.ncr_no ORDER BY n.log_date DESC";

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
    
        res.send(result)
        
    })
});

app.get('/ncr/:ncr_no', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = "SELECT * FROM ncr WHERE ncr_no = ?";

    db.query(sql, [req.params.ncr_no], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/ncr_products/:ncr_no', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = "SELECT * FROM ncr_products WHERE ncr_no = ?";

    db.query(sql, [req.params.ncr_no], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/ncr_components/:ncr_no', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = "SELECT * FROM ncr_components WHERE active = 'YES' && ncr_no = ?";

    db.query(sql, [req.params.ncr_no], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/ncr_components', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = "SELECT * FROM ncr_components WHERE active = 'YES'";

    db.query(sql, [req.params.ncr_no], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/ncr_products', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = "SELECT * FROM ncr_products";

    db.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});





app.post('/add_ncrproduct', (req, res) => {
    let emp = req.body
    console.log('Adding new product = ', emp)
    let sql = "INSERT INTO ncr_products (ncr_no, product_name, wattage, length, mounting, dimming, bb, qty) VALUES ?"
    let values = [
        [
            emp.ncr_no,
            emp.product_name,
            emp.wattage,
            emp.length,
            emp.mounting,
            emp.dimming,
            emp.bb,
            emp.qty
        ]
    ]
    db.query(sql, [values], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.end()
        }
    })
})

app.post('/delete_product', (req, res) => {
    let emp = req.body
    let sql = `DELETE FROM ncr_products WHERE id = ${emp.id}`
    
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.end()
        }
    })
})

app.post('/add_component', (req, res) => {
    let emp = req.body
    let sql = "INSERT INTO ncr_components (ncr_no, product, component, qty, supplier) VALUES ?"
    let values = [
        [
            emp.ncr_no,
            emp.product,
            emp.component,
            emp.qty,
            emp.supplier,
        ]
    ]
    db.query(sql, [values], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.end()
        }
    })
})

app.post('/delete_component', (req, res) => {
    let emp = req.body
    let sql = "UPDATE ncr_components SET active = 'NO' WHERE id = ?"
    console.log('delete called, emp = ', emp)
    
    db.query(sql, [emp.id], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.end()
        }
    })
})

app.post('/pics_upload', upload.array("image"), (req, res) => {
    console.log("Printing from pics_upload")
    let pics = req.files
    let emp = JSON.parse(JSON.stringify(req.body))
    //console.log('pics = ', pics)
    console.log('emp = ', emp)

   
    let file_string = ''

    if(pics.length>1) { //Different file columns
        for(let i = 0; i<emp.id.length; i++) {
            
            if(i == 0) {
                if(emp.existing_images[0] != 'null') {
                    file_string = emp.existing_images + ',' + pics[0].filename 
                }
                else {
                    file_string = pics[0].filename 
                }
                
               
            }
            
            if(i>0) {
                file_string = file_string + ',' + pics[i].filename
            }
            
            if(i == emp.id.length - 1) {
                console.log('file_string = ', file_string)
                let sql = `UPDATE ncr_products SET images = ${JSON.stringify(file_string)} WHERE id = ${emp.id[i]}`
                //console.log(sql)
                db.query(sql, (err, result) => {
                    if(err) {
                        console.log(err)
                    }
                })
            }
            
        }
    }
    if(pics.length == 1) {
        if(emp.existing_images != 'null') {
            file_string = emp.existing_images + ',' + pics[0].filename 
        }
        else {
            file_string = pics[0].filename 
        }
        let sql = `UPDATE ncr_products SET images = ${JSON.stringify(file_string)} WHERE id = ${emp.id}`
            //console.log(sql)
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                }
            })
    }

    res.end()
    
    
})

app.post('/ncr_upload', upload.array("file"), (req,res) => {
    let files = req.files
    let emp = JSON.parse(JSON.stringify(req.body))
    let reports = ''
    console.log('files = ', files)
    console.log('emp = ', emp)
    let file_string = null
    if(files.length>1) { //Different file columns
        for(let i = 0; i<emp.id.length; i++) {
            
            if(i == 0) {
                
                file_string = files[0].filename 
                //reports = file_string
               
            }
            
            if(i>0) {
                file_string = file_string + ',' + files[i].filename
            }
            
            if(i == emp.id.length - 1) {
                console.log('file_string = ', file_string)
                let sql = `UPDATE ncr_products SET ${emp.ref[i]} = ${JSON.stringify(file_string)} WHERE id = ${emp.id[i]}`
                //console.log(sql)
                db.query(sql, (err, result) => {
                    if(err) {
                        console.log(err)
                    }
                })
                console.log('emp.ref[i] = ', emp.ref[i])
                //if(emp.ref)
            }
            
        }
    }
    if(files.length == 1) {
        let sql = `UPDATE ncr_products SET ${emp.ref} = ${JSON.stringify(files[0].filename)} WHERE id = ${emp.id}`
            //console.log(sql)
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                }
            })
        console.log('emp.ref[i] = ', emp.ref)
    }

    if(emp.ref == 'report') {
        mailOptions.to = emp.email
        mailOptions.cc = 'maintenance@regentlight.co.za1'
        mailOptions.subject = `${emp.site}: ${emp.product} Report`
        mailOptions.text = `Hi ${emp.name},\n \n Please find ${emp.product} report attached`
        mailOptions.attachments = [{ path: 'uploads/'+ files[0].filename}]
        sendRealEmail(mailOptions)
        /*transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                
            } 
                //console.log('Email sent: ' + info.response);
                mailOptions.to = ''
                mailOptions.cc = ''
                mailOptions.subject = ''
                mailOptions.text = ''
                mailOptions.html = ''
                mailOptions.attachments = ''
                //res.send(data);
            
        
        });*/

    }

    res.end()
})

app.post('/delete_ncr', (req, res) => {
    let emp = req.body
    let sql = `UPDATE ncr SET active = ${false}, deleted_by = '${emp.person}' WHERE id = '${emp.id}'`
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.end()
    })
   
    
})


app.post('/ncr2', upload.array("image"), (req, res) => {
    let emp = JSON.parse(JSON.stringify(req.body))
    let images = req.files
    let ncr = JSON.parse(emp.ncr)
    let products = JSON.parse(emp.products)
    let pics = null
    let attachments = []
    let email_failure =''
    let email_qty = ''
    let email_components =''
    if(images.length>0) {
        pics = images[0].filename
        attachments = [{ path: 'uploads/'+ images[0].filename}]
    }
    for(let i = 1; i<images.length; i++) {
        pics = pics + ',' + images[i].filename
        attachments.push({ path: 'uploads/'+ images[i].filename})
    }
    console.log('ncr = ', ncr)
    console.log('products = ', products)
    console.log('images', images)
    
    //GET NCR NUMBER
    async.waterfall([
        function(callback) {
            const sql = "SET @product = ?; \
            CALL insertNcrNo(@product,@ncr_no);";
        
            db.query(sql, [ncr.product], (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({ type: 'ERROR', message: err.message })
                    callback(err.message, null)
                }
                else {
                callback(null, result)
                }
            })
        },
        //INSERT NCR DETAILS
        function(data, callback) {
            //JSON.parse(JSON.stringify( data[1][0]))
            console.log('data = ',  JSON.parse(JSON.stringify( data[1][0])).ncr_no)
            let ncr_id =  JSON.parse(JSON.stringify( data[1][0])).ncr_no
            let ncr_no = '' + ncr_id;
            while (ncr_no.length < 5) {
                ncr_no = '0' + ncr_no;
            }
            console.log('ncr_no = ', 'NCR'+ncr_no)
            ncr_no = 'NCR'+ncr_no
        
            const sql = 'INSERT INTO ncr (ncr_no, type, department, reported_by, sales_rep, region, manufactured, so, orig_so, project, client, responsible, logged_by, status, maint_status, comp_value, value, due_date, access) VALUES ?';

            let values = [
                [
                    ncr_no,
                    ncr.type,
                    ncr.department,
                    ncr.reported_by,
                    ncr.sales_rep,
                    ncr.region,
                    ncr.manufactured, //+'-00',
                    ncr.so,
                    ncr.orig_so,
                    ncr.project,
                    ncr.client,
                    //ncr.supplier,
                    ncr.responsible2,
                    ncr.logged_by,
                    ncr.status,
                    ncr.maint_status,
                    ncr.comp_value,
                    ncr.value,
                    ncr.due_date,
                    ncr.access
                    //pics
                ]
            ]

            db.query(sql, [values], (err, result) => {
                //if (err) throw err;
                if (err) {
                    console.log(err)
                    res.json({ type: 'ERROR', message: err.message })

                }
                else {
   
                    let sql2 = 'INSERT INTO ncr_products (ncr_no, product_name, wattage, length, mounting, dimming, bb, qty, category, failure, images) VALUES ?';
                    console.log('products = ', products.length)
                    let comp_check = products.filter(p => p.components.length > 0)
                    console.log('comp_check = ', comp_check)
                  
                        for(let i = 0; i<products.length; i++) {
                            if(i == 0) {
                                email_failure = products[i].failure
                                email_qty = products[i].qty
                            }
                            else {
                                email_failure = email_failure + ', ' + products[i].failure 
                                email_qty = email_qty + ', ' + products[i].qty
                            }
                            let product_pics = null
                            let pics_length = products[i].pics.length
                            if(pics_length>0) {
                                product_pics = images.find(img => img.originalname == products[i].pics[0].pic_name).filename
                            }
                            for(let j = 1; j<pics_length; j++) {
                            let pic = images.find(img => img.originalname == products[i].pics[j].pic_name).filename
                            product_pics = product_pics + ',' + pic
                            }
                            let values = [
                                [   
                                    ncr_no,
                                    products[i].name,
                                    products[i].wattage,
                                    products[i].length,
                                    products[i].mounting,
                                    products[i].dimming,
                                    products[i].bb,
                                    products[i].qty,
                                    products[i].category,
                                    products[i].failure,
                                    product_pics
                                ]
                            ]

                           // console.log('emp.data[1][i] = ', emp.data[1][i])
                            db.query(sql2, [values], (err2, result2) => {
                                if(err2) {
                                    console.log(err2)
                                    res.json({ type: 'ERROR', message: err2.message })
                                }
                                else {
                                    //INSERT COMPONENTS
                                    let sql3 = 'INSERT INTO ncr_components (ncr_no, product, component, qty, supplier) VALUES ?';
                                    console.log('products[i].components = ', products[i].components)
                                    let comp_length = products[i].components.length
                                    if(comp_check) {
                                        if(comp_length>0) {
                                            for(let k = 0; k<comp_length; k++) {
                                                if(k == 0) {
                                                    email_components = products[i].components[k].name    
                                                }
                                                else {
                                                    email_components = email_components + ', ' + products[i].components[k].name
                                                }
                                                
                                                let values2 = [
                                                    [
                                                        ncr_no,
                                                        products[i].name,
                                                        products[i].components[k].name,
                                                        products[i].components[k].qty,
                                                        products[i].components[k].supplier
                                                    ]
                                                ]
                                                db.query(sql3, [values2], (err3, result2) => {
                                                    if(err3) {
                                                        console.log(err3)
                                                        res.json({ type: 'ERROR', message: err3.message })
                                                    }
                                                    else {
                                                       
                                                                    
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    

                                }
                            })

                            if(i == products.length-1) {
                                send_email = true
                                console.log('Email sent on last product')
                                res.json({ type: 'SUCCESS', message: `${ncr_no} successfully added!` })
                                sendEmail(mailOptions, ncr, ncr_no, attachments, email_qty, email_components, email_failure)
                                res.end()
                            }
                        }
                }
            })
        }
    ])
})

app.post('/update_ncr', (req, res) => { //
    let emp = req.body;
    //console.log('emp = ', emp)
    let ncr_changes = JSON.parse(emp.ncr_changes)
    let prod_changes = JSON.parse(emp.prod_changes)
    let comp_changes = JSON.parse(emp.comp_changes)
    console.log('ncr_changes = ', ncr_changes)
    console.log('prod_changes = ', prod_changes)
    console.log('comp_changes = ', comp_changes)
    //res.end()

    let email = null
    let person = null
    let ncr_no = null
    if(ncr_changes.hasOwnProperty('email')) {
        email = ncr_changes.email
        person = ncr_changes.person
        ncr_no = ncr_changes.ncr_no
        delete ncr_changes['email']
        delete ncr_changes['person']
        delete ncr_changes['ncr_no']
    }
    if(ncr_changes.hasOwnProperty('status')) {
        if(ncr_changes.status == "assessed") {
            console.log("Send email to Dirk")
            mailOptions.to = 'Dirk@regentlight.co.za1'
            mailOptions.subject = `Tech-System: Close ${ncr_changes.ncr_no}`
            mailOptions.text = `Hi Dirk,\n\n Please close http://localhost:3000?ncr=${ncr_changes.ncr_no}, assessed by ${ncr_changes.assessed_by}.`
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
    }
    console.log('ncr_changes = ', ncr_changes)
    let keys = Object.keys(ncr_changes)
    let length = Object.keys(ncr_changes).length
    //console.log('length = ', length)
   

    if(length>0) { //There are NCR changes
         //let emp2 = JSON.stringify(ncr_changes)
        //console.log('emp2 = ', emp2)
        let sql = "UPDATE ncr SET ";
        
        for(let i = 0; i<length; i++) {
            console.log(`${keys[i]} = ${ncr_changes[keys[i]]}`)
            if(i<length-2) {
                sql = sql + `${keys[i]} = ${JSON.stringify(ncr_changes[keys[i]])}` + ', '
            }
            if(i == length-1) {
                sql = sql + `${keys[i-1]} = ${JSON.stringify(ncr_changes[keys[i-1]])} WHERE id = ${ncr_changes[keys[i]]}`
            }
        }

    
        //console.log('sql = ', sql)
        //res.end()
        
        db.query(sql, [ncr_changes.id], (err, result) => {
                //if (err) throw err;
                if (err) {
                    console.log(err)
                    res.json({ type: 'ERROR', message: err.message })

                }
                else {
                    if(prod_changes.length == 0 && comp_changes.length == 0) {
                        console.log('No product or component changes')
                        //res.send(result);
                    }
                    if(email != null) { //send email only if responsibility re-assigned
                        console.log(`${person} has changed ${ncr_no} to ${email}`)
                        mailOptions.to = email
                        mailOptions.subject = `${person} has re-assigned ${ncr_no} to you`
                        mailOptions.text = `http://localhost:3000?ncr=${ncr_no}`
                        mailOptions.attachments = ''
                        sendRealmail(mailOptions)
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

                }
        });
    }
    
    if(prod_changes.length>0) { //slse if
        console.log("I'm about to update products table")
        
        for(let i = 0; i<prod_changes.length; i++) {
            let sql2 = "Update ncr_products SET "
            let length = Object.keys(prod_changes[i]).length
            console.log('length = ', length)
            let keys = Object.keys(prod_changes[i])
            for(let j = 0; j<length; j++) {
                if(j < length-2) {
                    sql2 = sql2 + `${keys[j]} = ${JSON.stringify(prod_changes[i][keys[j]])}` + ', '
                }
                if(j == length-1)
                {
                    sql2 = sql2 + `${keys[j-1]} = ${JSON.stringify(prod_changes[i][keys[j-1]])} WHERE id = ${prod_changes[i].id}`
                }
            }
            //sql2 = "Update ncr_products SET "
            //console.log('sql2 = ', sql2)
            db.query(sql2, (err, result) => {
                if(err) {
                    console.log(err)
                }
                else {
                    /*if(comp_changes.length == 0) {
                        res.send(result);
                    }*/
                }
            })
        }
       
    }

    if(comp_changes.length>0) { //else if
        console.log("I'm about to update components table")
        for(let i = 0; i<comp_changes.length; i++) {
            let sql3 = "Update ncr_components SET "
            let length = Object.keys(comp_changes[i]).length
            console.log('length = ', length)
            let keys = Object.keys(comp_changes[i])
            for(let j = 0; j<length; j++) {
                if(j < length-2) {
                    sql3 = sql3 + `${keys[j]} = ${JSON.stringify(comp_changes[i][keys[j]])}` + ', '
                }
                if(j == length-1)
                {
                    sql3 = sql3 + `${keys[j-1]} = ${JSON.stringify(comp_changes[i][keys[j-1]])} WHERE id = ${comp_changes[i].id}`
                }
            }
            
            db.query(sql3, (err, result) => {
                if(err) {
                    console.log(err)
                }
               
            })
        }
        
    }
    

   res.end()
   
});

app.post('/ncr', upload.array("image"), (req, res) => { //upload.array("images", 10),
    let emp = req.body;
    //console.log('req = ', req)
    let pics = null
    let images = req.files
    let attachments = []
    if(images.length>0) {
        pics = images[0].filename
        attachments = [{ path: 'uploads/'+ images[0].filename}]
    }
    for(let i = 1; i<images.length; i++) {
        pics = pics + ',' + images[i].filename
        attachments.push({ path: 'uploads/'+ images[i].filename})
    }
    console.log('image = ', images)
    let ncr = JSON.parse(JSON.stringify(emp))
    ncr = ncr.ncr
    emp = JSON.parse(ncr)
    console.log('emp = ', emp)
    //res.end()
    async.waterfall([
        function(callback) {
            const sql = "SET @product = ?; \
            CALL insertNcrNo(@product,@ncr_no);";
        
            db.query(sql, [emp.product], (err, result) => {
                if (err) {
                    console.log(err);
                    //res.json({type: 'ERROR', message: err.message})
                    callback(err.message, null)
                }
                else {
                //console.log('result = ', result)
                //res.send(result);
                callback(null, result)
                }
            })
        },
        function(data, callback) {
            //JSON.parse(JSON.stringify( data[1][0]))
            console.log('data = ',  JSON.parse(JSON.stringify( data[1][0])).ncr_no)
            let ncr_id =  JSON.parse(JSON.stringify( data[1][0])).ncr_no
            let ncr_no = '' + ncr_id;
            while (ncr_no.length < 5) {
                ncr_no = '0' + ncr_no;
            }
            console.log('ncr_no = ', 'NCR'+ncr_no)
            ncr_no = 'NCR'+ncr_no
            //res.end()
            //const emp = req.body;
            const sql = 'INSERT INTO ncr (ncr_no, type, product, components, qty, failure, reported_by, sales_rep, region, so, project, client, supplier, responsible, logged_by, status, due_date, images) VALUES ?';

            let values = [
                [
                    ncr_no,
                    emp.type,
                    emp.product,
                    emp.components,
                    emp.qty,
                    emp.failure,
                    emp.reported_by,
                    emp.sales_rep,
                    emp.region,
                    emp.so,
                    emp.project,
                    emp.client,
                    emp.supplier,
                    emp.responsible,
                    emp.logged_by,
                    emp.status,
                    emp.due_date,
                    pics
                ]
            ]

            db.query(sql, [values], (err, result) => {
                //if (err) throw err;
                if (err) {
                    console.log(err)
                    res.json({ type: 'ERROR', message: err.message })

                }
                res.send(result);
                console.log('attachments = ', attachments)
                mailOptions.to = emp.email
                mailOptions.subject = `${ncr_no} Has Been Assigned To You`
                mailOptions.text = `Hi ${emp.responsible},\n`
                mailOptions.attachments = attachments
                mailOptions.html = '<!DOCTYPE html>'+
                '<html><head><title>Appointment</title>'+
                '</head><body><div>'+
                `Hi ${emp.responsible}`+
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
                            `<td> ${emp.type}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Product</b></td>'+
                            `<td> ${emp.product}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Qty</b></td>'+
                            `<td> ${emp.qty}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Componentst</b></td>'+
                            `<td> ${emp.components}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Failure</b></td>'+
                            `<td> ${emp.failure}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>SO</b></td>'+
                            `<td> ${emp.so}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Project/Site</b></td>'+
                            `<td> ${emp.project}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Region</b></td>'+
                            `<td> ${emp.region}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Logged By</b></td>'+
                            `<td> ${emp.logged_by}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Responsible</b></td>'+
                            `<td> ${emp.responsible}</td>`+
                        '</tr>'+
                        '<tr >'+
                            '<td><b>Due</b></td>'+
                            `<td> ${emp.due_date}</td>`+
                        '</tr>'+
                    '</tbody >'+
                '<table>'+
                '</div></body></html>'

                //mailOptions.attachments = ''
                sendRealEmail()
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

            });
        }
    ])


})






module.exports = app