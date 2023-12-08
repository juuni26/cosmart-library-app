const express = require('express')
const MainController = require('../controllers/mainController')

const router = express.Router()

router.get('/genre', MainController.getGenre)
router.get('/books', MainController.getBooks)
router.get('/schedule', MainController.getSchedule)
router.post('/schedule', MainController.pickupSchedule)

module.exports = router
