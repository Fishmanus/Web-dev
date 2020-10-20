const express = require('express')
//const session = require('express-session')
//const fileStore = require('session-file-store') (session)
const fs = require('fs')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const path = require('path')
const createError = require("http-errors");
const weekEnd = require('./WeekEnd')
const findLongestWord = require('./findLongestWord')
//const passport = require('passport')


const PORT = 3001
const CODE = 'yes.'

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

//app.use(express.static(path.join(__dirname, 'public')))

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


function authMiddle(req, res, next) {
    if(req.query.code === CODE)
        next()
    else
        throw createError (403, "You're not logged in!")
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function start() {
    try {
        await mongoose.connect("mongodb+srv://fishmanus:12345ss@cluster0.dzsv7.mongodb.net/Tasks", {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        app.use(function (req, res, next) {
            let url = req.url
            console.log(Date(), url)
            next()
        })

        app.use(express.static('./public'))

        /* GET home page. */
        app.get('/', ((req, res) => {
            res.render('index', {
                title: 'Home'
            })
        }))


        app.get('/auth2', (req, res) => {
            res.render('auth2')
        })
        app.get('/auth3', (req, res) => {
            res.render('auth3')
        })
        app.get('/auth1', (req, res) => {
            res.render('auth1')
        })

        app.get('/task1', ((req, res) => {
            res.render('Task1', {
                title: 'Task 1',
                msg: req.query.str,
                isWorkDay: weekEnd.getWeekEnd(req.query.str)
            })
        }))

        app.get('/task2', authMiddle, ((req, res) => {
            res.render('Task2', {
                title: 'Task 2',
                msg: req.query.str,
                txt: findLongestWord.findLongestWord(req.query.str)
            })
        }))

        app.get('/task3', authMiddle, (async (req, res) => {

            await sleep(req.query.str)

            res.render('Task3', {
                title: 'Task 3',
                msg: req.query.str,
                txt: ('You lost ' + req.query.str + ' ms')
            })
        }))


        app.use((req, res, next) => {
            next(createError(404))
        })

        app.use((err, req, res, next) => {
            res.status(err.status || 500)

            fs.appendFile ('log.log', Date() +' At: ' + req.url + ' Status:\t' + err.status + ' Description: ' + err.message + req.method + '\t\n', function (err) {})

        })

        app.listen(PORT, () => {
            console.log('Listening on port ' + PORT + '...')
        })
    } catch (err) {
        console.log(err)
    }
}

start()
