if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('express-flash')
//'mongodb://localhost/SmartCapture'

const indexRouter = require('./routes/index')
const custRouter = require('./routes/cust')
const bookingRouter = require('./routes/booking')
const userRouter = require('./routes/user')

require('./config/passport')(passport)

app.use(methodOverride('_method'))
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', "ejs")
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

const mongoose = require('mongoose')
//mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
mongoose.connect('mongodb+srv://user:ovWDnQEqnwyofByT@cluster0.ninp4.mongodb.net/SmartCapture?retryWrites=true&w=majority', { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
)

//process.env.SESSION_SECRET 

app.use(passport.initialize());
app.use(passport.session())
app.use(flash())

app.use('/', indexRouter)
app.use('/cust', custRouter)
app.use('/booking', bookingRouter)
app.use('/user', userRouter)

app.listen(process.env.PORT || 3000)