const express= require("express")
const TableRoute = express.Router();
const { Table } = require('../../DB/dbConn')

TableRoute.get('/:TableName', async (req, res, next) => {
    try{
       var queryResult = await Table.getTableData(req.params.TableName, req.query.select.split(','));
       res.json(queryResult[0])
   }
   catch(err){
       console.log(err)
       res.sendStatus(500)
   }
})

TableRoute.post('/:TableName', async (req, res, next) => {
    let { select, valuesList} = req.body;
    console.log(select, valuesList)

    try{
       var queryResult = await Table.addTableItem(req.params.TableName, select, valuesList);
       res.json(queryResult[0])
   }
   catch(err){
       console.log(err)
       res.sendStatus(500)
   }
})

module.exports = TableRoute;