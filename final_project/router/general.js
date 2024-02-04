const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("111")
    if (username && password) {
        console.log("222")
      if (isValid(username)) {
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
    new Promise((resolve) => {
        resolve(books);
    })
    .then(books => {
        res.send(JSON.stringify(books,null,4));
    })
    .catch(error => {
        console.error("Error fetching books:", error);
        res.status(500).send("Failed to fetch books");
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject('Book not found');
        }
    })
    .then(book => {
        res.send(JSON.stringify(book, null, 4));
    })
    .catch(error => {
        res.status(404).send(error);
    });
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject('No books found by the specified author');
        }
    })
    .then(booksByAuthor => {
        res.json(booksByAuthor);
    })
    .catch(error => {
        res.status(404).send(error);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject('No books found by the specified title');
        }
    })
    .then(booksByTitle => {
        res.json(booksByTitle); 
    })
    .catch(error => {
        res.status(404).send(error); 
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; 
    const book = books[isbn]; 

    if (book) {
        res.send(book.reviews); 
    } else {
        res.status(404).send('Book not found'); 
    }
});

module.exports.general = public_users;
