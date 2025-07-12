const mysql = require('mysql2');
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})


conn.connect((err) => {
    if (err) {
        console.log("ERROR: " + err.message);
        return;
    }
    console.log('Connection established');
})

let dataPool = {
    getTableInfoList: () => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM TableInfo`, (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
        })
    },
    getTableInfo: (TableName) => {
        return new Promise((resolve, reject) => {
            conn.query(`DESCRIBE ${conn.escapeId(TableName)}`, (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
        })
    }
}

module.exports = dataPool;