const express = require('express')
const router = express.Router()
const Cust = require('../models/cust')

//All customers
router.get('/', async (req, res) => {
    let searchoptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchoptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const custs = await Cust.find({searchoptions})
        res.render('cust/index', { custs: custs, searchoptions: req.query })
    } catch {
        res.redirect('/')
    }    
})

// new customers
router.get('/new', (req, res) => {
    res.render('cust/new', { cust: new Cust()})
})

//create customers, we use async because everything in Mongodb is done asynchronous
router.post('/', async (req, res) => {
    const cust = new Cust({
        name: req.body.name,
        email: req.body.email,
        cell: req.body.cell,
        licenceplate: req.body.licenceplate
    })
    try {
        const newCust = await cust.save()
        res.redirect('cust')
    } catch {
        res.render( 'cust/new', {
            cust: cust,
            errorMessage: 'Error creating customer'
        })
    }
})

router.get('/:id', (req, res) => {
    res.send('Show Customer ' + req.params.id)
})
router.get('/:id/edit', async (req, res) => {
    try {
        const cust = Cust.findById(req.params.id)
        res.render('cust/edit', {cust: cust })
    } catch {
        res.redirect('/cust')
    }
})
router.put('/:id', (req, res) => {
    res.send('Update customer ' + req.params.id)
})
router.delete('/:id', (req, res) => {
    res.send('Delete customer ' + req.params.id)
})

module.exports = router
