const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const mongoose = require('mongoose')

const { forwardAuthenticated } = require('../config/auth')

const initializePassport = require('../config/passport')
initializePassport(passport, 
    username => User.find(user => user.username === username),
    id => User.find(user => user.id === id)
)

router.get('/login', (req, res) =>
    res.render('login')
)
    
router.get('/register', (req, res) => 
    res.render('register', { users : new User()})
)

router.post('/register', async (req, res) => {
    const users = new User({
        username: req.body.username,
        pass: req.body.pass 
    })
    if (users.username == '' || users.pass == '' || req.body.pass2 == '') {
        res.render('register', {
            users: users,
            errorMessage: 'Ensure all fields are complete.'
        })
    } else if (users.pass !== req.body.pass2) {
        res.render('register', {
            users: users,
            errorMessage: 'Ensure both password fields are correct.'
        }) 
    } else if (users.pass.length <= 7) {
        res.render('register', {
            users: users,
            errorMessage: 'Password should be longer than 7 characters.'
        })
    } else {
        try {
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(users.pass, salt, (err, hash) => {
                if (err) {
                    throw(err)
                } else {
                   users.pass = hash 
                   const newuser = users.save()
                   res.render('success')
                }               
            }))      
        } catch {
            res.render('register', {
                users: users,
                errorMessage: 'Error creating user'
            })
        }
    }   
})

router.post('/login', async (req, res) => {
    const users = new User({
        username: req.body.username,
        pass: req.body.pass 
    })
    if (users.username == '' || users.pass == '') {
        res.render('login', {
            users: users,
            errorMessage: 'Ensure all fields are complete.'
        })
    } else { 
        const currentuser = await User.findOne({username : users.username})
        if (currentuser == null || currentuser == '') {
            res.render('login', {
                users: users,
                errorMessage: 'Username does not exist.'
            })
        } else {
            bcrypt.compare(users.pass, currentuser.pass, function(err, result) {
                if (result) {
                    res.render('homepage')
                } else {
                    res.render('login', {
                        users: users,
                        errorMessage: 'Password is incorrect.'
                    })
                }
            })        
        }  
    }       
})

module.exports = router

