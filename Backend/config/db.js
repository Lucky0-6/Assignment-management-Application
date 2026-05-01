const sql = require('mssql');

const config={
     user: 'sa',
    password: 'Student@123',
    server: 'localhost',
    database: 'StudentAssignmentDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

sql.connect(config)
    .then(pool=>{
        console.log('connected to database sql server')
    })
    .catch(err=>{
        console.log('erro while connecting sql server',err)
    })

module.exports=sql;