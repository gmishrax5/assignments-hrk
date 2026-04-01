const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// cluster credentials
mongoose.connect(process.env.MONGODB_URI)
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
            id: user._id.toString(),
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


app.post("/todo", auth ,   function(req, res) {
    const userId = req.useId;
        const tittle = req.body.title;

        TodoModel.create({
            tittle,
            userId
        })

    res.json({
        userId: userId,
    });
});


app.get("/todos", auth ,  function(req, res) {
    const userId = req.useId;

    const todos = await TodoModel.find({
        userId: userId
    })
    res.json( {
        todos: todos
        });
});

//  auth middleware
// function auth(req, res, next) {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : req.headers.token;
//     if (!token) {
//         res.json({
//             message: "Token is missing"
//         })
//         return;
//     }

//     try {
//         const decodedData = jwt.verify(token, JWT_SECRET);
//         if (decodedData.username) {
//             req.username = decodedData.username
//             next()
//         } else {
//             res.json({
//                 message: "Invalid token"
//             })
//         }
//     } catch (e) {
//         res.json({
//             message: "Invalid token"
//         })
//     }
// }


function auth(req, res, next) {
    const authHeader = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    if (decodedData) {
        req.userId = decodedData.id
        next();
    } else {
        res.status(403).json({
            message: "Invalid token"
        });
    }
    } 



app.listen(3000);