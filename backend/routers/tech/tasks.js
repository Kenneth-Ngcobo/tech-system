const { Router } = require('express')
const db = require('../../databases/tech')
const app = Router()
var fun = require('../../functions/functions')
const async = require('async');

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


app.get('/tasks', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = "SELECT * FROM tasks WHERE status = 'active'";

    db.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/archived/:res', (req, res) => {
    console.log('req.params = ', req.params)
    const sql = "SELECT * FROM tasks WHERE responsible = ? && status = 'archived'";

    db.query(sql, [req.params.res], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/tasks/:person', (req, res) => {
    let emp = req.params
    const sql = "SELECT * FROM tasks WHERE status = 'active' && stage = 'Staging' && responsible = ?";

    db.query(sql, [emp.person], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.get('/todos', (req, res) => {
    //console.log('req.params = ', req.params)
    const sql = "SELECT * FROM todos";

    db.query(sql, (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({type: 'ERROR', message: err.message})
            
        }
        res.send(result);
    });
});

app.post('/tasks', (req, res) => { //
    let emp = req.body;
    console.log('emp = ', emp)
    let task = JSON.parse(emp.task)
    let to_dos = JSON.parse(emp.to_dos)
    console.log('task = ', task)
    console.log('to-dos = ', to_dos)
    async.waterfall([
        function(callback) {
            const sql = "INSERT INTO tasks (prio, task, type, responsible, assigned_by, stage, due, status) VALUES ?";
            let values = [
                [
                    task.prio,
                    task.task,
                    task.type,
                    task.responsible,
                    task.assigned_by,
                    task.stage,
                    task.due,
                    'active'
                ]
            ]

            db.query(sql, [values], (err, result) => {
                //if (err) throw err;
                if (err) {
                    console.log(err)
                    res.json({ type: 'ERROR', message: err.message })
                    callback(err.message, null)
                }
                else {
                    callback(null, result)
                }
               
            });
        },
        function(data, callback) {
            //console.log('data = ', data)
            let data2 = JSON.parse(JSON.stringify(data))
            let task_id = data2.insertId
          
            for(let i = 0; i<to_dos.length; i++) {
                const sql = "INSERT INTO todos (prio, task_id, to_do, due, finished, done) VALUES ?";
                let finished = null
                if(to_dos[i].done) {
                    finished = fun.today()
                }
                let values = [
                    [
                        i,
                        task_id,
                        to_dos[i].to_do,
                        to_dos[i].due,
                        finished,
                        to_dos[i].done
                    ]
                ]
                db.query(sql, [values], (err, result) => {
                    //if (err) throw err;
                    if (err) {
                        console.log(err)
                        res.json({ type: 'ERROR', message: err.message })
                        //callback(err.message, null)
                    }
                    else {
                        if(i == to_dos.length-1) {
                            res.send(result)
                        }
                       
                        //callback(null, result)
                    }
                   
                });
            }

            if(to_dos.length == 0) {
                res.end()
            }

            
        }
    ])
    if(task.assigned_by != task.responsible) {
        let email = ''
        if(task.responsible == 'Kenneth') {
            email = 'kenneth@regentlight.co.za'
        }
        if(task.responsible == 'Welcome') {
            email = 'welcome.m@regentlight.co.za'
        }
        if(task.responsible == 'Lindo') {
            email = 'lindo@wahl.co.za'
        }
        if(task.responsible == 'Moses') {
            email = 'moses.n@regentlight.co.za'
        }
        mailOptions.to = email
        mailOptions.subject = `New Task Assigned: ${task.task}`
        mailOptions.text = `Hi ${task.responsible},\n\n ${task.assigned_by} has assigned a new task to you`
        mailOptions.attachments = ''
        mailOptions.html = '<!DOCTYPE html>'+
            '<html><head><title>Appointment</title>'+
            '</head><body><div>'+
            `Hi ${task.responsible}`+
            '<br>'+
            `${task.assigned_by} has assigned a new task to you`+
            '<br>'+
            '<table border="1" style="border-collapse:collapse; width:50%">'+
                '<thead >'+
                    '<th >Parameter</th>'+
                    '<th >Value</th>'+
                '</thead>'+
                '<tbody>'+
                    '<tr >'+
                        '<td><b>Task</b></td>'+
                        `<td> ${task.task}</td>`+
                    '</tr>'+
                    '<tr >'+
                        '<td><b>Type</b></td>'+
                        `<td> ${task.type}</td>`+
                    '</tr>'+
                    '<tr >'+
                        '<td><b>Due</b></td>'+
                        `<td> ${task.due}</td>`+
                    '</tr>'+
                '</tbody>'+
            '<table>'+
            '</div></body></html>'
                    
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
    
    
});

app.post('/modify_todos', (req, res) => {

    let changes = JSON.parse(req.body.changes)
    console.log('changes = ', changes)
    for(let i = 0; i<changes.length; i++) {
        let keys = Object.keys(changes[i])
        let length = keys.length
        let sql = `UPDATE todos SET `
        for(j = 1; j<length; j++) {
            if(j != length-1) {
             sql = sql + `${keys[j]} = ${JSON.stringify(changes[i][keys[j]])}` + ', '
            }
            else {
                sql = sql  + `${keys[j]} = ${JSON.stringify(changes[i][keys[j]])} WHERE id = ${changes[i].id}`
            }
        }
        console.log('sql = ', sql)
        db.query(sql, (err, result) => {
            if(err) {
                console.log(err)
            }
            else {
                if(i == changes.length-1) {
                    res.send(result)
                }
                
            }
        })
    }
    //res.end()
})

app.post('/new_todo', (req, res) => {
    let emp = req.body
    let sql = "INSERT INTO todos (prio, task_id, to_do, due, finished, done) VALUES ?"
    let values = [
        [
            emp.prio,
            emp.task_id,
            emp.to_do,
            emp.due,
            null,
            emp.done
        ]
    ]
    db.query(sql, [values], (err, result) => {
        //if (err) throw err;
        if (err) {
            console.log(err)
            res.json({ type: 'ERROR', message: err.message })
            //callback(err.message, null)
        }
        else {
            res.send(result)
        }
    })
})

app.post('/delete_todo', (req, res) => {
    console.log('req.body.id = ', req.body.id)
    let sql =  `DELETE FROM todos WHERE id = ${req.body.id}`
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.post('/update_stage', (req, res) => { 
    let emp = req.body
    let sql = "UPDATE tasks SET stage = ? WHERE id = ?"

    db.query(sql, [emp.stage, emp.id], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.post('/update_stage2', (req, res) => { 
    let changes = JSON.parse(req.body.changes)
    console.log('changes = ', changes)
    for(let i = 0; i<changes.length; i++) {
        let sql = ""
        if(Object.keys(changes[i]).length == 2) {
            sql = `UPDATE tasks SET prio = ${changes[i].prio} WHERE id = ${changes[i].id}` //Changing priority only
        }
        if(Object.keys(changes[i]).length == 4) {
            sql = `UPDATE tasks SET prio = ${changes[i].prio}, stage = ${JSON.stringify(changes[i].stage)}, completed_on = ${JSON.stringify(changes[i].completed_on)} WHERE id = ${changes[i].id}` //Changing priority and stage
        }
        db.query(sql, (err, result) => {
            if(err) {
                console.log(err)
            }
            else {
                if(i == changes.length-1) {
                    res.send(result)
                }
            }
        })
    }
    //res.end()
    //let sql = "UPDATE tasks SET stage = ? WHERE id = ?"

   
})

app.post('/update_task_status', (req, res) => { 
    let emp = req.body
    let sql = "UPDATE tasks SET status = ? WHERE id = ?"

    db.query(sql, [emp.status, emp.id], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.post('/update_task', (req, res) => { 
    let emp = req.body
    console.log('emp = ', emp)
    let length = Object.keys(emp).length
    let keys = Object.keys(emp)
    let sql = "UPDATE tasks SET "
    for(let i = 0; i<length; i++) {
        if(i<length-2) {
            sql = sql + `${keys[i]} = ${JSON.stringify(emp[keys[i]])}` + ', '
        }
        if(i == length-1) {
            sql = sql + `${keys[i-1]} = ${JSON.stringify(emp[keys[i-1]])} WHERE id = ${emp[keys[i]]}`
        }
        
    }
    console.log('sql = ', sql)
    

    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
})

app.post('/reassign', (req, res) => { 
    let emp = req.body
    let sql = "UPDATE tasks SET responsible = ?, assigned_by = ? WHERE id = ?"

    db.query(sql, [emp.responsible, emp.assigned_by, emp.id], (err, result) => {
        if(err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
    let email = ''
    if(emp.responsible == 'Kenneth') {
        email = 'kenneth@regentlight.co.za'
    }
    if(emp.responsible == 'Welcome') {
        email = 'welcome.m@regentlight.co.za'
    }
    if(emp.responsible == 'Lindo') {
        email = 'lindo@wahl.co.za'
    }
    mailOptions.to = email
    mailOptions.subject = `Task Re-assigned: ${emp.task}`
    //mailOptions.text = `Hi ${emp.responsible},\n\n ${emp.assigned_by} has assigned a new task to you`
    mailOptions.attachments = ''
    mailOptions.html = '<!DOCTYPE html>'+
        '<html><head><title>Appointment</title>'+
        '</head><body><div>'+
        `Hi ${emp.responsible}`+
        '<br>'+
        `${emp.assigned_by} has re-assigned a task to you`+
        '<br>'+
        '<table border="1" style="border-collapse:collapse; width:50%">'+
            '<thead >'+
                '<th >Parameter</th>'+
                '<th >Value</th>'+
            '</thead>'+
            '<tbody>'+
                '<tr >'+
                    '<td><b>Task</b></td>'+
                    `<td> ${emp.task}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Type</b></td>'+
                    `<td> ${emp.type}</td>`+
                '</tr>'+
                '<tr >'+
                    '<td><b>Due</b></td>'+
                    `<td> ${emp.due}</td>`+
                '</tr>'+
            '</tbody>'+
        '<table>'+
        '</div></body></html>'
                
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
})

module.exports = app