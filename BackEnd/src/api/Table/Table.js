const express = require("express")
const TableRoute = express.Router();
const { Table } = require('../../DB/dbConn')

TableRoute.get('/:TableName', async (req, res, next) => {
    try {
        var queryResult = await Table.getTableData(req.params.TableName, req.query.select.split(','));
        res.json(queryResult[0])
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

TableRoute.get('/getById/:TableName', async (req, res, next) => {
    try {
        var queryResult = await Table.getTableDataById(req.params.TableName, req.query.select.split(','), req.query.id);
        res.json(queryResult[0])
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

TableRoute.post('/:TableName', async (req, res, next) => {
    let { select, valuesList, id } = req.body;
    console.log(select, valuesList)

    try {
        if(id == undefined)
            var queryResult = await Table.addTableItem(req.params.TableName, select, valuesList);
        else 
            var queryResult = await Table.updateTableItem(req.params.TableName, select, valuesList, id);
        res.json(queryResult[0])
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = TableRoute;