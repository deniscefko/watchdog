const Movie = require('../models/Movie')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
// const movieList = require('../middleware/movieList')

router.post('/users/movies', auth, async (req, res) => {
    const { title, genre } = req.body
    try {
        const movie = new Movie({ title, genre, owner: req.user._id })
        await movie.save()
        res.status(200).send(movie)

    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/movies', auth, async (req, res) => {
    try {
        const movies = await Movie.find({ owner: req.user.id })
        res.status(200).send(movies)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/movie/:id', async (req, res) => {
    const { id } = req.params
    try {
        const movie = await Movie.findById(id)
        res.status(200).send(movie)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('users/movie/:id', auth, async (req, res) => {
    const { id } = req.params
    let movieList = await Movie.find({ owner: req.user.id })

    console.log(movieList)
    try {
        movieList = movieList.filter(movie => movie._id !== id)
        await movieList.save()
        res.status(200).send(movieList)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router