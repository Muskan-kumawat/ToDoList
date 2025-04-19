const express = require("express");
const bodyParser =require("body-parser");
const ejs = require("ejs");
const encrypt = require('mongoose-encryption');

const dotenv = require('dotenv');
dotenv.config({});

var app = new express;
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));   
app.use(express.static('public'));


const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/todo");


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = process.env.SECRET; // Use the secret from .env file;
userSchema.plugin(encrypt,{secret: secret, encryptedFields:["password"]});

const user = mongoose.model("User",userSchema);

const todoSchema = new mongoose.Schema({
    userId: String,
    name: String,
});

const todo = mongoose.model("Todo", todoSchema);

// const item = mongoose.model("second",trySchema);

// const todo = new item({
//     name: "Create some videos"
// });
// const todo2 = new item({
//     name: "Learn DSA"
// });
// const todo3 = new item({
//     name: "Learn React"
// });
// const todo4 = new item({
//     name: "Take some rest"
// });
// todo.save();
// todo2.save();
// todo3.save();
// todo4.save();

let currentUserId = null;

app.get("/", (req, res) => res.render("home"));
app.get("/login", (req,res)=> res.render("login"));
app.get("/register",(req, res) => res.render("register"));
app.post("/logout", (req,res) => res.redirect("/"));

app.post("/register",async function(req, res){
    try{   
        const newUser = new user({
            email : req.body.username,
            password : req.body.password
        });
        await newUser.save();
        currentUserId = newUser._id; 
        res.redirect("/list");
    }
    catch(err){
        console.log(err);
    }
});

app.post("/login",async function(req, res){ 
    const username = req.body.username;
    const password = req.body.password;
    try{ 
        const foundUser = await user.findOne({email: username});

        if(foundUser){
            if(foundUser.password === password){
                currentUserId = foundUser._id;
                res.redirect("/list");
            }
            else{
                res.send("Incorrect password.");
            }   
        }
        else{
            res.send("User not found.");
        }
    }
    catch(err){
        console.log(err);
    }
});



app.get("/list",async function(req, res){
    if (!currentUserId) return res.redirect("/login"); // Redirect to login if user is not logged in
    
    // item.find({ userID: currentUserId }) // Use the currentUserId to find items for the logged-in user
    //     .then(foundItems => res.render("list",{dayej : foundItems}))
    //     .catch (err => {
            //     console.log("❌ Error retrieving items:", err);
            // });

    try{
        const tasks = await todo.find({ userId: currentUserId });
        res.render("list", { dayej: tasks });
    }
    catch(err){
        console.log("❌ Error retrieving items:", err);
    }
}); 

app.post("/list",async function(req,res){
    if (!currentUserId) return res.redirect("/login"); // Redirect to login if user is not logged in
    
    const taskName = req.body.ele1;
    
    const newTask =new todo({
        userId: currentUserId,
        name : taskName,
    });
        
    try{
        await newTask.save();
        res.redirect("/list");
    }
    
    catch(err){
        console.log("❌ Error saving task:", err);
    }
    
});




app.post("/delete",async function(req, res) {
    const taskId = req.body.checkbox1; // Get the ID from the request

    try{
        await todo.findByIdAndDelete(taskId) // Correct method for deletion
        console.log("Item Deleted Successfully!");
        res.redirect("/list"); // Redirect to the homepage after deletion
    }
    catch(err ){
        console.log("Error deleting item:", err);
        // res.status(500).send("Internal Server Error"); // Send error response
    };
});


app.listen("3000",function(){
    console.log("Server is running at 3000...");
});