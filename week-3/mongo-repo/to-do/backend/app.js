const bcrypt = require("bcrypt");
const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { z } = require("zod");
require("dotenv").config();




// const JWT_SECRET = process.env.JWT_SECRET;

// // cluster credentials
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log("Connected to MongoDB successfully"))
//     .catch((err) => console.error("Database connection error:", err.message));

const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {
    const requireBody = z.object ({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2)

    })
    const parsedDataWithSuccess = requireBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        res.status(400).json({
            message: "Invalid request body",

        });
        return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name; 
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
    
        await UserModel.create({
            email: email,
            password: hashedPassword,
            name: name
        });
        
        res.json({
            message: "You are signed up"
        });
    } catch(e) {
        res.status(500).json({
            message: "Error while signing up"            
        });
    }
});

app.post("/signin",  async function(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
    });

    if(!response) {
        res.status(403).json({
            message: "user credentials does not exist in our database"
        })
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);


    if (passwordMatch) {
        
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


app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;

    try {
        await TodoModel.create({
            title,
            userId,
            done: false
        });

        res.json({
            message: "Todo created",
            userId: userId,
        });
    } catch (e) {
        res.status(500).json({
            message: "Error while creating todo"
        });
    }
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId: userId
    })
    res.json({
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