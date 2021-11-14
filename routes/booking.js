const express = require('express')
const { NativeDate } = require('mongoose')
const router = express.Router()
const Booking = require('../models/booking')
const Cust = require('../models/cust')

//All bookings
router.get('/', async (req, res) => {
    let searchoptions = {}
    if (req.query.site != null && req.query.site !== '') {
        searchoptions.site = new RegExp(req.query.site, 'i')
    }
    try {
        const bookings = await Booking.find({searchoptions})
        res.render('booking/index', { bookings: bookings, searchoptions: req.query })
    } catch {
        res.redirect('/')
    }   
})

// new booking
router.get('/new', async (req, res) => {
    try {
        const custs = await Cust.find({})
        const bookings = new Booking()
        res.render('booking/new', { custs: custs, bookings: bookings })
    } catch {
        res.redirect('booking')
    }
})

//create booking, we use async because everything in Mongodb is done asynchronous
router.post('/new', async (req, res) => { 
    const bookings = new Booking({
        site: req.body.site,
        arrival: new Date(req.body.arrival),
        departure: new Date(req.body.departure),
        cust: req.body.cust
    })   
    if (bookings.site == '' || bookings.arrival == '' || bookings.departure == '' || bookings.cust == '') {
        res.render('booking/new', {
            bookings: bookings,
            errorMessage: 'Ensure all fields are complete.'
        })
    } else {
        try {
            await bookings.save()
            res.redirect('/booking')
        } catch {
            res.render( 'booking/new', {
                bookings: bookings,
                errorMessage: 'Error creating booking.'
            })
        }
    }
})

router.get('/:id', (req, res) => {
    res.send('Show Booking ' + req.params.id)
})

router.get('/:id/edit', async (req, res) => {
    try {
        const custs = await Cust.find({})
        const bookings = await Booking.findById(req.params.id)
        res.render('booking/edit', {custs: custs, bookings: bookings })
    } catch {
        res.redirect('/booking')
    }
})
router.put('/:id', async (req, res) => {
    let bookings 
    try {
        bookings = await Booking.findById(req.params.id)
        bookings.site = req.body.site
        bookings.arrival = req.body.arrival
        bookings.departure = req.body.departure
        bookings.cust = req.body.cust
        await bookings.save()
        res.redirect('/booking')
    } catch {
        if (bookings == null) { 
            res.redirect('/homepage')
        } else {
            res.render('booking/edit', {
            bookings: bookings,
            errorMessage: 'Error updating booking'
        })
      }
    }
})

router.delete('/:id', async (req, res) => {
    let bookings
    try {
      bookings = await Booking.findById(req.params.id)
      await bookings.remove()
      res.redirect('/booking')
    } catch {
      if (bookings != null) {
        res.render('/booking', {
          bookings: bookings,
          errorMessage: 'Could not remove booking'
        })
      } else {
        res.redirect('/')
      }
    }
  })


module.exports = router
