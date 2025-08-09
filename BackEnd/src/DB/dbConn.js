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
            let response = await connection.query(`SELECT TC.* FROM TableInfo TI INNER JOIN TableColumns TC ON TC.TableInfoId = TI.Id WHERE TI.TableName LIKE "${TableName}"`);
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    }
}

const cleanSelect = (sel, connect) => {
    sel = sel.trim();
    return sel == "*"? sel : connect.escapeId(sel);
};

const constructValues = (values, connection) => {
    return `(${values.map((val) => connection.escape(val)).join(",")})`
}

let Table = {
    getTableData: async (TableName, select = ["*"]) => {
        const connection = await conn.getConnection();
        try{
            let response = await connection.query(`SELECT ${select.map((sel) => cleanSelect(sel, connection)).join(", ")} FROM ${connection.escapeId(TableName)}`);
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    },

    getTableDataById: async (TableName, select = ["*"], Id) => {
        const connection = await conn.getConnection();
        try{
            let response = await connection.query(`SELECT ${select.map((sel) => cleanSelect(sel, connection)).join(", ")} FROM ${connection.escapeId(TableName)} WHERE Id = ${connection.escape(Id)}`);
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    },

    addTableItem: async (TableName, select, valuesList) => {
        const connection = await conn.getConnection();
        try{
            let response = await connection.query(`INSERT INTO ${connection.escapeId(TableName)}(${select.map((sel) => cleanSelect(sel, connection)).join(", ")}) VALUES ${valuesList.map((values) => constructValues(values, connection)).join(",")}`);

            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    },

    updateTableItem: async (TableName, select, values, id) => {
        const connection = await conn.getConnection();
        try{
            let response = await connection.query(`UPDATE ${connection.escapeId(TableName)} SET ${select.map((sel, ind) => `${cleanSelect(sel, connection)}=${connection.escape(values[ind])}`).join(",")} WHERE Id = ${connection.escape(id)}`);

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
            let response = await connection.query('SELECT * FROM UserInfo WHERE Name = ?', username);
            await connection.release();
            return response[0];
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    },

    AddUser: async (username,email,password) => {
        const connection = await conn.getConnection();
        try {
            let response = await connection.query(`INSERT INTO UserInfo (user_name,user_email,user_password) VALUES (?,?,?)`, [username, email, password])[0];
            await connection.release();
            return response;
        } catch(error) {
            console.error(error);
        }
        await connection.release();
    }
}

module.exports = { TableInfo, Table, User };