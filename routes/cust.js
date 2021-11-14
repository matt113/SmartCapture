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
        const cust = await Cust.find({searchoptions})
        res.render('cust/index', { cust: cust, searchoptions: req.query })
    } catch {
        res.redirect('/')
    }    
})

// new customers
router.get('/new', (req, res) => {
    res.render('cust/new', { cust: new Cust()})
})

//create customers, we use async because everything in Mongodb is done asynchronous
router.post('/new', async (req, res) => {
    const cust = new Cust({
        name: req.body.name,
        email: req.body.email,
        cell: req.body.cell,
        licenceplate: req.body.licenceplate
    })
    if (cust.name == '' || cust.email == '' || cust.cell == '' || cust.licenceplate == '') {
        res.render('cust/new', {
            cust: cust,
            errorMessage: 'Ensure all fields are complete.'
        })
    } else {
        try {
            await cust.save()
            res.redirect('/cust')
        } catch {
            res.render( 'cust/new', {
                cust: cust,
                errorMessage: 'Error creating customer'
            })
        }
    }
    
})

router.get('/:id', (req, res) => {
    res.send('Show Customer ' + req.params.id)
})

router.get('/:id/edit', async (req, res) => {
    try {
        const cust = await Cust.findById(req.params.id)
        res.render('cust/edit', { cust: cust})
    } catch {
        res.redirect('/cust')
    }
})

router.put('/:id', async (req, res) => {
    let cust 
    try {
        cust = await Cust.findById(req.params.id)
        cust.name = req.body.name
        cust.email = req.body.email
        cust.cell = req.body.cell
        cust.licenceplate = req.body.licenceplate
        await cust.save()
        res.redirect('/cust')
    } catch {
        if (cust == null) { 
            res.redirect('/homepage')
        } else {
            res.render('cust/edit', {
            cust: cust,
            errorMessage: 'Error updating customer'
        })
      }
    }
})

router.delete('/:id', async (req, res) => {
    let cust
    try {
      cust = await Cust.findById(req.params.id)
      await cust.remove()
      res.redirect('/cust')
    } catch {
      if (cust == null) {
        res.redirect('/')
      } else {
        res.render('cust/index', { errorMessage: Error})
      }
    }
})

module.exports = router
