const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user_model')
const bCrypt = require ('bcrypt-nodejs')


module.exports = function(passport) {

    let isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password)
    }

    let createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }


    //signup
    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            let findOrCreateUser = function () {
                // find a user in Mongo
                User.findOne({'username': username}, function (err, user) {
                    // In case of any error
                    if (err) {
                        console.log('Error in SignUp: ' + err)
                        return done(err)
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ' + username)
                        return done(null, false, req.flash('message', 'User Already Exists'))
                    } else {
                        // if there is no user
                        let newUser = new User()
                        newUser.username = username
                        newUser.password = createHash(password)

                        // save the user
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err)
                                throw err
                            }
                            console.log('User Registration successful')
                            return done(null, newUser)
                        })
                    }
                })
            }
            process.nextTick(findOrCreateUser)
        })
    )


    //login
    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        User.findOne({'username': username},
            function (err, user) {
                // In case of error
                if (err)
                    return done(err)
                // Username does not exist
                if (!user) {
                    console.log('User Not Found with username ' + username)
                    return done(null, false, req.flash('message', 'User Not found.'))
                }
                // User exists but wrong password
                if (!isValidPassword(user, password)) {
                    console.log('Invalid Password')
                    return done(null, false, req.flash('message', 'Invalid Password'))
                }
                // Success!
                return done(null, user)
            }
        )

    }))

    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user)
        done(null, user._id)
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user)
            done(err, user)
        })
    })

}

