const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String
})

const User = mongoose.model('user', UserSchema)
module.exports = User