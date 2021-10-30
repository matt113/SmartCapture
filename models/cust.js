const mongoose = require('mongoose')

const custSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Cust', custSchema)