const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'mySecretForWatchdog')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error('error')
        }

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = auth