const express= require("express")
const UserRoute = express.Router();
const { User } = require('../../DB/dbConn')

UserRoute.post('/login', async (req, res) => {
    
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        try {
            let queryResult = await User.AuthUser(username);
            
            if (queryResult.length > 0) {
                if (password == queryResult[0].Password) {
                    req.session.logged_in = true;
                    res.status(200).json({ success: true, message: "LOGIN OK" });
                }
                else {
                    console.log("INCORRECT PASSWORD");
                    res.status(200).json({ success: false, message: "INCORRECT PASSWORD" });
                }
            } else {
                console.log("USER NOT REGISTRED");
                res.status(200).json({ success: false, message: "USER NOT REGISTRED" });
            }
        }
        catch (err) {
            console.log(err)
            res.status(404)
        }
    }
    else {
        console.log("Please enter Username and Password!")
        res.status(404).json({ success: false, message: "Please enter Username and Password!" });
    }
    res.end();
});

UserRoute.post("/logout", async (req, res) => {
    req.session.logged_in = false;
    res.status(200).json({success: true})
})

UserRoute.post('/auth', async (req, res) => {
    res.json({isAuth: req.session.logged_in == true});
    res.end();
});

module.exports = UserRoute;