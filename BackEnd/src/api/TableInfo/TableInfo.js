const express = require("express")
const TableInfoRoute = express.Router();
const { TableInfo } = require('../../DB/dbConn')

TableInfoRoute.get('/', async (req, res, next) => {
    try {
        var queryResult = await TableInfo.getTableInfoList();
        res.json(queryResult[0])
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

TableInfoRoute.get('/columns/:TableName', async (req, res, next) => {
    try {
        var queryResult = await TableInfo.getTableColumns(req.params.TableName);
        for(let item of queryResult[0]) {
            item.IsForeignKey = item.IsForeignKey[0] == 1;
            item.IsNullable = item.IsNullable[0] == 1;
            item.IsPrimaryKey =  item.IsPrimaryKey[0] == 1;
        }
        res.json(queryResult[0])
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = TableInfoRoute;