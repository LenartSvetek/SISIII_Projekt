const express= require("express")
const TableRoute = express.Router();
const { Table }=require('../../DB/dbConn')

TableRoute.get('/:TableName', async (req, res, next) => {
    try{
       var queryResult = await Table.getTableData(req.params.TableName);
       res.json(queryResult)
   }
   catch(err){
       console.log(err)
       res.sendStatus(500)
   }
})

module.exports = TableRoute;