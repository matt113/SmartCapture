const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    site: {
        type: Number,
        required: true
    },
    arrival: {
        type: Date,
        required: false
    },
    departure: {
        type: Date,        
        required: false
    },
    cust: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    }
})

module.exports = mongoose.model('Booking', bookingSchema)