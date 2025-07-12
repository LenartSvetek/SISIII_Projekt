const express= require("express")
const TableInfo = express.Router();
const DB=require('../../DB/dbConn')

TableInfo.get('/', async (req, res, next)=>{
   try{
       var queryResult = await DB.getTableInfoList();
       res.json(queryResult)
   }
   catch(err){
       console.log(err)
       res.sendStatus(500)
   }
})

TableInfo.get('/:TableName', async (req, res, next) => {
    try{
       var queryResult = await DB.getTableInfo(req.params.TableName);
       res.json(queryResult)
   }
   catch(err){
       console.log(err)
       res.sendStatus(500)
   }
})

module.exports = TableInfo;