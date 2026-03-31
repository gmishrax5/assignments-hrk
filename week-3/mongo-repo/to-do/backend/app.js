const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const JWT_SECRET = "asdfghjkl";


// cluster credentials
mongoose.connect("mongodb+srv://dummygm545:taklaverysmart@rtc.2h1juil.mongodb.net/todo-mishry-55")
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.error("Database connection error:", err.message));

const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {
   
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
    
        await UserModel.create({
            email: email,
            password: password,
            name: name
        });
        res.json({
            message: "You are signed up"
        });
    
    
        
    }
});


app.post("/signin",  async function(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password
    });


        console.log(user);


    if (user) {
        
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        });
            
    }

    else{
        res.status(403).json({
            message: "Invalid credentials"
        });
    }
});


app.post("/todo", function(req, res) {

});


app.get("/todos", function(req, res) {

});

app.listen(3000);