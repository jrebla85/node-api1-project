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
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
            res.status(200).json(user)
        }
    })
    .catch(err => {
        res.status(500).json({ message: "The user information could not be retrieved" })
    })
})

server.delete("/api/users/:id", async (req, res) => {
    try{
        const{id} = req.params
        const deletedUser = await Users.remove(id)
        if(!deletedUser){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }else{
            res.status(200).json(deletedUser)
        }
    }catch(err){
        res.status(500).json({message: "The user could not be removed"})
    }
})

server.put("/api/users/:id", async (req, res) => {
    try{
        const {id} = req.params
        const changes = req.body

        const existingUser = await Users.findById(id)
        if(!existingUser){
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
            if(!changes.name || !changes.bio){
                res.status(400).json({ message: "Please provide name and bio for the user" })
            }else{
              const updatedUser =  await Users.update(id, changes)
              res.status(200).json(updatedUser)
            }
        }
    }catch{
        res.status(500).json({ message: "The user information could not be modified" })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
