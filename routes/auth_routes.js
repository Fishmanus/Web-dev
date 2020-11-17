const router = require('express').Router()
const taskFunctions = require('../taskFunctions.js')



let isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next()
    // if the user is not authenticated at session
    res.redirect('/')
}

module.exports = function(passport){

    /* GET login page. */
    router.get('/', function(req, res) {
        res.render('login', {
            message: req.flash('loginMessage'),
            title: 'Login Page'
        })
    })

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash : true
    }))

    /* GET Signup Page */
    router.get('/signup', function(req, res){
        res.render('signup',{
            message: req.flash('signupMessage'),
            title: 'Signup Page'
        })
    })

    /* Handle Signup POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true
    }))

    /* GET Home Page */
    router.get('/home', isAuthenticated, function(req, res){
        res.render('home', { user: req.user })
    })

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout()
        res.redirect('/')
    })


    /* Handle Tasks pages */
    router.get('/task2Entry', (req, res) => {
        res.render('task2Entry')
    })
    router.get('/task3Entry', (req, res) => {
        res.render('task3Entry')
    })
    router.get('/task1Entry', (req, res) => {
        res.render('task1Entry')
    })

    router.get('/task1', isAuthenticated, ((req, res) => {
        res.render('task1', {
            title: 'Task 1',
            msg: req.query.str,
            isWorkDay: taskFunctions.getWeekEnd(req.query.str)
        })
    }))

    router.get('/task2', isAuthenticated, ((req, res) => {
        res.render('task2', {
            title: 'Task 2',
            msg: req.query.str,
            txt: taskFunctions.findLongestWord(req.query.str)
        })
    }))

    router.get('/task3', isAuthenticated, (async (req, res) => {

        await taskFunctions.sleep(req.query.str)

        res.render('task3', {
            title: 'Task 3',
            msg: req.query.str,
            txt: ('You lost ' + req.query.str + ' ms')
        })
    }))

    return router
}

