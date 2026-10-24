const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Create CRUD operation with POST to register a new user
public_users.post("/register", (req,res) => {
    //Save user data
    const username = req.body.username;
    const password = req.body.password;

    //Verify both username and password were given
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    //Verify both username and password were given and username is unique
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(200).json({ message: "User already exists!" });
        }
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    //If there is a book with the ISBN code, it returns it
    if (books[isbn]) {
        return res.status(200).send(books[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
    let bookByAuthor = Object.values(books).filter((book) => book.author.toLowerCase() === author);

    //If there is a book with the author, it returns it
    if (bookByAuthor.length > 0) {
        return res.status(200).send(bookByAuthor);
    }

    return res.status(404).json({ message: "No books found for this author" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    let bookByTitle = Object.values(books).filter((book) => book.title.toLowerCase() === title);

    //If there is a book with the title, it returns it
    if (bookByTitle.length > 0) {
        return res.status(200).send(bookByTitle);
    }

    return res.status(404).json({ message: "No books found with this title" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    //If there is a book with the ISBN code, it returns the review
    if (books[isbn]) {
        return res.status(200).send(books[isbn].reviews);
    }

    return res.status(404).json({ message: "Book not found" });
});

// Async/Await with Axios - Get all books
async function getAllBooksAxios() {
    try {
        const response = await axios.get("http://localhost:5000/");
        return response.data;
    } catch (error) {
        console.error(error.message);
    }
  }
  
  // Promise with Axios - Get book by ISBN
  function getBooksByISBNAxios(isbn) {
    return axios
        .get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => response.data)
        .catch(error => console.error(error.message));
  }
  
  // Async/Await with Axios - Get books by author
  async function getBooksByAuthorAxios(author) {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );
        return response.data;
    } catch (error) {
        console.error(error.message);
    }
  }
  
  // Async/Await with Axios - Get books by title
  async function getBooksByTitleAxios(title) {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );
        return response.data;
    } catch (error) {
        console.error(error.message);
    }
  }

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooksAxios;
module.exports.getBooksByISBN = getBooksByISBNAxios;
module.exports.getBooksByAuthor = getBooksByAuthorAxios;
module.exports.getBooksByTitle = getBooksByTitleAxios;
