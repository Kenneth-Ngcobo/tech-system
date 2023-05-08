var Request = require('tedious').Request



module.exports = {

    
    today() {
        let newDate = new Date()
        let dt = ('0' + (newDate.getDate())).slice(-2)
        let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
        let yr = (newDate.getFullYear()).toString()
        return (yr + '-' + mth + '-' + dt)
    },
    
    executeStatement(sage, sql, callback) {
        let counter = 0
        let response = []
        let request = new Request(sql, (err, row) => {
            if (err) {
            //throw err;
            console.log(err)
            return callback(err)
            }

            return callback(null, response)
        
        });
        
        
        request.on('row', (columns) => {
            var obj = {};
            //console.log(columns.length)
            columns.forEach((column) => {
            
            var key = column.metadata.colName
            var value = column.value
            obj[key] = value
            response[counter] = (obj)
            
            });

            counter += 1
            
        });

        request.on('requestCompleted', function () {
            
        })
        
        sage.execSql(request) 
    },

   
    
}

