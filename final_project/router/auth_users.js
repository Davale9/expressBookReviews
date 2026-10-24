const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithusername = users.filter((user) => {
        return user.username === username;
    });

    if (userswithusername.length > 0) {
        return false;
    } else {
        return true
    }
}

const authenticatedUser = (username, password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
           username: username 
        }, "access", { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    const review = req.body.review;

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `User ${username} added a review to book ISBN #:${isbn}` });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: `Review from user ${username} deleted successfully` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
