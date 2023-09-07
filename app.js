//jshint esversion:6
require('dotenv').config();
const express = require ("express");
const bodyParser = require ("body-parser");
const ejs = require ("ejs");
const mongoose = require ("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
  });

  

  

  const User = new mongoose.model("User", userSchema);

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});


app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: username,
        password: hash
    });
    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    }) 
    });

     

});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

// console.log(foundUser);
User.findOne({email:username})
.then((foundUser) => {
    if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result === true){
            res.render("secrets");
            }
        });
    }
})
.catch((err) => {
   //When there are errors We handle them here
console.log(err);
   res.send(400, "Bad Request");
});

});


app.listen(3000,function(){
    console.log("Server started on a port 3000");
});
