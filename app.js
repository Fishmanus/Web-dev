const express = require('express')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const keys = require('./config/keys')
const path = require('path')

const app = express()


//view engine(ejs)&static
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views/'))
//app.use('/', express.static('./public'))
app.use('/assets', express.static('assets'))

//connect mongo
mongoose.set('useUnifiedTopology', true)
mongoose.connect(keys.mongoDB.uri,()  => {
    console.log('connected to mongoDB')
})

app.use(cookieSession({
    maxAge: 30*60*1000,
    keys: [keys.session.cookieKey]
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())
app.use(expressSession({secret: 'totallySecretKey'}))
app.use(flash())

//passport
app.use(passport.initialize())
app.use(passport.session())
const initPassport = require('./config/passport_setup')//(passport)
initPassport(passport)

const routes = require('./routes/auth_routes')(passport)
app.use('/', routes)

/* home route
app.get('/', (req, res) => {
    res.render('home')
})
*/

app.listen(3001, ()=> {
    console.log('listening on port 3001')
})