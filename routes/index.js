const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.render('welcome.ejs')  
})

router.get('/homepage', async (req, res) => {
    res.render('homepage.ejs')  
})

router.get('/success', async (req, res) => {
    res.render('success')
})

module.exports = router