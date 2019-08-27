const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const movieRouter = require('./routers/movies')

const app = express()
const port = 3001

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

app.use(express.json()) // parses response in object so we can access res.body
app.use(userRouter)
app.use(movieRouter)

module.exports = app