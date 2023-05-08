const express = require('express');
var cors = require('cors')
const app = express();

var bodyParser = require('body-parser');


/***************       TECH DATABASE ROUTES             ************************************************************* */

const tech_so_import = require('./routers/tech/so_import');
const boards = require('./routers/tech/boards');
const maint_projects = require('./routers/tech/maint_projects');
const ncr_reports = require('./routers/tech/ncr_report');
const tech_ncr = require('./routers/tech/ncr');
const pastel_ncr = require('./routers/tech/pastel_ncr');
const tech_stock = require('./routers/tech/stock');
const tasks = require('./routers/tech/tasks');
const tech_testing = require('./routers/tech/testing');
const users = require('./routers/tech/users');
const utilities = require('./routers/tech/utilities');


/*******************       SFA DATABASE ROUTES               **************************************************************** */

const sfa_so_import = require('./routers/sfa/so_import');
const forecast = require('./routers/sfa/quote_forecast')


/*******************       SAGE DATABASE ROUTES               **************************************************************** */

const sage_so_import = require('./routers/sage/so_import')
const stock = require('./routers/sage/stock')
const pos = require('./routers/sage/pos')
const mrp = require('./routers/sage/mrp')
const maint = require('./routers/sage/maint')



app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

app.use(boards)
app.use(maint_projects)
app.use(ncr_reports)
app.use(tech_ncr)
app.use(pastel_ncr)
app.use(tech_so_import)
app.use(tech_stock)
app.use(tasks)
app.use(tech_testing)
app.use(users)
app.use(utilities)

app.use(sfa_so_import)
app.use(forecast)

app.use(stock)
app.use(pos)
app.use(sage_so_import)
app.use(mrp)
app.use(maint)

app.use('/uploads', express.static('uploads'))


let port = 2000

app.set('env','dev');

if(app.get('env') == 'dev') {
    port = 2000
   
}
if(app.get('env') == 'prod') {
    port = 3001
}


 
app.listen(port, () =>
  console.log(`Express listening on port ${port}!`),
);