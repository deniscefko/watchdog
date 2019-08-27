const User = require('../models/user')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

router.get('/users/me', auth, async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        await user.save()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    const user = req.user
    try {
        user.tokens = user.tokens.filter(token => token.token !== req.token)
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    const user = req.user
    try {
        user.tokens = []
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()

        res.status(200).send({ user, token })

    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    const user = req.user
    const params = req.body

    if (!isValidUpdate) {
        return res.status(400).send("error: You can't update that field")
    }

    try {
        updates.forEach(update => user[update] = params[update])
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/:id', auth, async (req, res) => {
    try {
        const user = req.user
        await user.remove()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router

