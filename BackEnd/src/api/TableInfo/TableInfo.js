const express= require("express")
const TableInfoRoute = express.Router();
const { TableInfo }=require('../../DB/dbConn')

TableInfoRoute.get('/', async (req, res, next)=>{
   try{
       var queryResult = await TableInfo.getTableInfoList();
       res.json(queryResult)
   }
   catch(err){
       console.log(err)
       res.sendStatus(500)
   }
})

TableInfoRoute.get('/columns/:TableName', async (req, res, next) => {
    try{
       var queryResult = await TableInfo.getTableColumns(req.params.TableName);
       res.json(queryResult)
   }
   catch(err){
       console.log(err)
       res.sendStatus(500)
   }
})

module.exports = TableInfoRoute;