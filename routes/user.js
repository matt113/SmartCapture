const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/login', (req, res) =>
    res.render('login', {users: new User()})
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

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/homepage',
        failureRedirect: '/user/login'
    })(req, res, next)
})

module.exports = router

