const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let bookPromise = new Promise((resolve,reject) => {
    resolve(books)
})
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

  
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   
    bookPromise.then((data)=>{
        res.send(JSON.stringify(data));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    bookPromise.then((data)=>{
        res.send(data[isbn]);
    })
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    
    bookPromise.then((data)=>{
        let authorBooks = []
        for(let bookIndex in data){
            if(data[bookIndex]['author']===author){
                authorBooks.push(data[bookIndex])
            }
        }
        res.send(JSON.stringify(authorBooks));
    })
    
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    bookPromise.then((data)=>{
        let titleBooks = []
        for(let bookIndex in data){
            if(data[bookIndex]['title']===title){
                titleBooks.push(data[bookIndex])
            }
        }
        res.send(JSON.stringify(titleBooks));
    })
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    bookPromise.then((data)=>{
        res.send(data[isbn]["reviews"]);
    })
});

module.exports.general = public_users;
