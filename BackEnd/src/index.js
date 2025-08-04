const express = require('express')
const session = require('express-session');

require('dotenv').config()
const DB = require('./DB/dbConn.js')

const port = process.env.PORT || 5000 //Specify your own port here!!!

const app = express()

const cors = require("cors")


// configurations
app.use(session({
    secret: "a97b8737-8d27-49d3-a624-bcd6ba7db886",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods: ["GET", "POST"],
}))

const TableInfo = require("./api/TableInfo/TableInfo.js")
app.use("/api/TableInfo/", TableInfo);

const Table = require("./api/Table/Table.js")
app.use("/api/Table/", Table);

const User = require("./api/User/User.js")
app.use("/api/User/", User);

app.get("/", (req, res) => {
    res.send("hola")
})

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port: ${process.env.PORT || port}`)
})

