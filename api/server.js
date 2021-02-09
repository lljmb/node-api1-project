// BUILD YOUR SERVER HERE
const express = require('express')
const generate = require('shortid').generate

const server = express()
server.use(express.json())

// accessing the data
const dbFunctions = require('./users/model.js')

// POST	/api/users ceates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
    const {name, bio} = req.body
    if( !name || !bio ){
        res.status(400).json({message: 'Please provide name and bio for the user'})
    } else {
        dbFunctions.insert({id: generate(), name, bio})
        .then((newUser) =>  {
            res.status(201).json(newUser)
        })
        .catch(() => {
            res.status(500).json({
                message: 'There was an error while saving the user to the database'
            })
        })
    }
})

// GET /api/users returns an array of users.
server.get('/api/users', (req, res) => {
    dbFunctions.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(() => {
        res.status(500).json({
            message: 'The users information could not be retrieved',
        })
    })
})

// GET /api/users/:id returns the user object with the specified id.
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    dbFunctions.findById(id)
    .then(user => {
        user ? res.status(200).json(user) 
        : res.status(404).json({message: 'The user with the specified ID does not exist'})
    })
    .catch(() => {
            res.status(500).json({message: 'The user information could not be retrieved'})
    })
})

// DELETE /api/users/:id removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    dbFunctions.remove(id)
    .then(deleted => {
        deleted ? res.status(200).json(deleted) : 
        res.status(404).json({message: 'The user with the specified ID does not exist'})
    })
    .catch(() => {
        res.status(500).json({message: 'The user could not be removed'})
    })
})

// PUT /api/users/:id updates the user with the specified id using data from the request body. Returns the modified user
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params
    const { name, bio } = req.body
    if ( !name || !bio ){
        res.status(400).json({message: 'Please provide name and bio for the user'})
    } else {
        dbFunctions.update(id, {name, bio})
        .then((user) => {
            user ? res.status(200).json({name, bio})
            : res.status(404).json({message: 'The user with the specified ID does not exist'})
        })
        .catch(() => {
            res.status(500).json({message: 'The user information could not be modified'})
        })
    }
})

// catch all
server.use('*', (req, res) => {
    res.status(404).json({message: '404 not found'})
})

module.exports = server // EXPORT YOUR SERVER instead of {}
