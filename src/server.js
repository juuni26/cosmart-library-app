const express = require('express')
const MainRouter = require('./routes/mainRouter')

const INTERNET_MODE = process.env.NODE_ENV || 'online'

const app = express()
const port = 3000
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', MainRouter)

app.listen(port, host, () => {
  console.log(
    `Server is running on http://${host}:${port}/api/books, internet-mode : ${INTERNET_MODE} `
  )
})
