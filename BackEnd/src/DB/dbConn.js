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

let TableInfo = {
    getTableInfoList: () => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM TableInfo`, (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
        })
    },
    getTableColumns: (TableName) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT TC.* FROM TableInfo TI INNER JOIN TableColumns TC ON TC.TableInfoId = TI.TabInfoId WHERE TI.TableName LIKE "${TableName}"`, (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
        })
    }
}

let Table = {
    getTableData: (TableName) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM ${conn.escapeId(TableName)}`, (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
        })
    }
}

module.exports = { TableInfo, Table };