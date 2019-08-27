const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email format error')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('movies', {
    ref: 'Movie',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email })

    if (!user) {

        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Unable to login")
    }

    return user
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, 'mySecretForWatchdog')

    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

// hash the plain text passwprd before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)  // test it!!!
    }
    next()
})

const User = new mongoose.model('User', userSchema)

module.exports = User