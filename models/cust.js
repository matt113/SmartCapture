const mongoose = require('mongoose')
const Booking = require('./booking')

const custSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cell: {
        type: String,
        required: true
    },
    licenceplate: {
        type: String,
        required: true
    }
})

//custSchema.pre('remove', function(next) {
//  Booking.find({ cust: this.id }, (err, bookings) => {
//    if (err) {
//      next(err)
//    } else if (bookings.length > 0) {
//      next(new Error('This customer still has bookings.'))
//    } else {
//      next()
//    }
//  })
//})


module.exports = mongoose.model('Cust', custSchema)