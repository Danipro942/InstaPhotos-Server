const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
    name: {
        type: String,
        require: true
    },

    username: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    avatar: {
        type: String,
        trim: true
    },

    siteoWeb: {
        type: String,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },
    
    password: {
        type: String,
        trim: true,
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }

})  

UserSchema.index({username: 'text'});


module.exports = mongoose.model('User', UserSchema)