// BUILD YOUR SERVER HERE
const express = require("express");
const Users = require("./users/model");

const server = express();

server.use(express.json());

server.post("/api/users", (req, res) => {
    const createUser = req.body;
    if(!createUser.name || !createUser.bio){
        res.status(400).json({ message: "Please provide name and bio for the user" })
    }else{
        Users.insert(createUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error while saving the user to the database" })
        })
    }
})

server.get("/api/users", (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ message: "The users information could not be retrieved" })
    })
})

server.get("/api/users/:id", (req, res) => {
    const idVar = req.params.id;

    Users.findById(idVar)
    .then(user => {
        if(!user){
            res.status(404).json("The user with the specified ID does not exist")
        }else{
            res.status(200).json(user)
        }
    })
    .catch(err => {
        res.status(500).json("The user information could not be retrieved")
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
