const mysql = require('mysql2/promise');

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    connectionLimit: 10 
})

// const conn = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_DATABASE
// })


// conn.connect((err) => {
//     if (err) {
//         console.log("ERROR: " + err.message);
//         return;
//     }
//     console.log('Connection established');
// })

let TableInfo = {
    getTableInfoList: async () => {
        const connection = await conn.getConnection();
        try{
            let response = await connection.query(`SELECT * FROM TableInfo`);
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    },
    getTableColumns: async (TableName) => {
        const connection = await conn.getConnection();
        try{
            let response = await connection.query(`SELECT TC.* FROM TableInfo TI INNER JOIN TableColumns TC ON TC.TableInfoId = TI.TabInfoId WHERE TI.TableName LIKE "${TableName}"`);
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    }
}

let Table = {
    getTableData: async (TableName) => {
        const connection = await conn.getConnection();
        try{
            let response = connection.query(`SELECT * FROM ${connection.escapeId(TableName)}`);
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    }
}

let User = {
    AuthUser: async (username) => {
        const connection = await conn.getConnection();
        try {
            let response = await connection.query('SELECT * FROM user_login WHERE user_name = ?', username);
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    },

    AddUser: async (username,email,password) => {
        const connection = await conn.getConnection();
        try {
            let response = await connection.query(`INSERT INTO user_login (user_name,user_email,user_password) VALUES (?,?,?)`, [username, email, password]);
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    }
}

module.exports = { TableInfo, Table, User };