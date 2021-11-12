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
        res.render('booking/new', { custs: custs, bookings: bookings, })
    } catch {
        res.redirect('booking')
    }
})

//create booking, we use async because everything in Mongodb is done asynchronous
router.post('/', async (req, res) => { 
    let bookings = new Booking({
        site: req.body.site,
        arrival: new Date(req.body.arrival),
        departure: new Date(req.body.departure),
        cust: req.body.cust
    })
    try {
        const newBooking = await bookings.save()
        res.redirect('booking')
    } catch {
        const custs = await Cust.find({})
        res.render( 'booking/new', {
            bookings: bookings, custs: custs,
            errorMessage: 'Error creating booking'
        })
    }
})

router.get('/:id', (req, res) => {
    res.send('Show Booking ' + req.params.id)
})
router.get('/:id/edit', async (req, res) => {
    try {
        const booking = Booking.findById(req.params.id)
        res.render('booking/edit', {booking: booking })
    } catch {
        res.redirect('/booking')
    }
})
router.put('/:id', (req, res) => {
    res.send('Update booking ' + req.params.id)
})
router.delete('/:id', (req, res) => {
    res.send('Delete booking ' + req.params.id)
})


module.exports = router
