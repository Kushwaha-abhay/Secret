//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config()
//const md5= require("md5");
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});
//console.log("code=="+process.env.SECRET);

//userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);
//TODO
app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});

app.get("/secrets", function(req,res){
  res.render("secrets");
});

app.get("/submit", function(req,res){
  res.render("submit");
});

app.post("/register", function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const user1= new User({
      email:req.body.username,
    //  password:md5(req.body.password
    password:hash
  })

    user1.save(function(err){
      if(!err)
      res.render("secrets")
    })
});


});

app.post("/login", function(req, res){

  User.findOne({email:req.body.username}, function(err,founduser){
    if(founduser)
    {
    
      bcrypt.compare(req.body.password, founduser.password, function(err, result) {
          if(result)
          res.render("secrets");
      });

    }

    else
      console.log(username+"  login Failed   "+founduser+  "  error="+err);

  })
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
