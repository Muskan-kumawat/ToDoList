const express = require("express");
const bodyParser =require("body-parser");

var app = new express;
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));   
app.use(express.static('public'));


const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todo");
const trySchema = new mongoose.Schema({
    name : String,
});
const item = mongoose.model("task",trySchema);
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


app.get("/",function(req, res){
    item.find({})
    
        .then(foundItems => res.render("list",{dayej : foundItems}))
        .catch (err => {
            console.log("❌ Error retrieving items:", err);
            // res.status(500).send("Internal Server Error");
        });
    }); 

app.post("/",function(req,res){
    const itemName = req.body.ele1;
    const todo =new item({
        name : itemName,
    })
    todo.save();
    res.redirect("/");
});

// app.post("/delete",function(req,res){
//     const checkedId = req.body.checkbox1;
//     item.findByIdAndDelete(checkedId)
//     .then ( () => { 
//         console.log("Item Deleted Successfully!");
//         res.render("/");
//     })
//     .catch(err => {
//         console.log("❌ Error deleting item:", err);
//         // res.status(500).send("Internal Server Error"); // Send error response
//     })
// });


app.post("/delete", function(req, res) {
    const checkedId = req.body.checkbox1; // Get the ID from the request

    item.findByIdAndDelete(checkedId) // Correct method for deletion
        .then(() => {
            console.log("Item Deleted Successfully!");
            res.redirect("/"); // Redirect to the homepage after deletion
        })
        .catch(err => {
            console.log("Error deleting item:", err);
            // res.status(500).send("Internal Server Error"); // Send error response
        });
});


app.listen("3000",function(){
    console.log("Server is running...");
});