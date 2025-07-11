const express = require('express')
require('dotenv').config()
const DB = require('./DB/dbConn.js')

const port = process.env.PORT || 5000 //Specify your own port here!!!

const app = express()

const cors = require("cors")


// configurations
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
  methods:["GET", "POST"],
}))

const TableInfo = require("./api/TableInfo/TableInfo.js")
app.use("/api/TableInfo/", TableInfo);

app.get("/",(req,res)=>{
res.send("hola")
})

app.listen(process.env.PORT || port, ()=>{
    console.log(`Server is running on port: ${process.env.PORT || port}`)
})

