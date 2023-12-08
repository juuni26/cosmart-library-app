const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const INTERNET_MODE = process.env.NODE_ENV || 'online'
const BOOK_SCHEDULE = []
const GENRES = ['humor', 'fantasy', 'literature']
let booksData = []

if (INTERNET_MODE === 'offline') {
  booksData = require('../offline/BOOKS.json')
}

/**
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 */

/**
 * @typedef {Object} BookController
 * @property {function(ExpressRequest, ExpressResponse): Promise<void>} getGenre
 * @property {function(ExpressRequest, ExpressResponse): Promise<void>} getBooks
 * @property {function(ExpressRequest, ExpressResponse): Promise<void>} getSchedule
 * @property {function(ExpressRequest, ExpressResponse): Promise<void>} pickupSchedule
 */

/**
 * @type {BookController}
 */

const fetchBooks = async () => {
  const humor = axios.get(
    `https://openlibrary.org/subjects/${GENRES[0]}.json?limit=20`
  )
  const fantasy = axios.get(
    `https://openlibrary.org/subjects/${GENRES[1]}.json?limit=20`
  )
  const literature = axios.get(
    `https://openlibrary.org/subjects/${GENRES[2]}.json?limit=20`
  )

  const responses = await Promise.all([humor, fantasy, literature])
  const genres = responses.map(response => response.data.works)
  const books = [...genres[0], ...genres[1], ...genres[2]]

  let id = 1
  const allBooks = []
  const booksId = {}

  for (const book of books) {
    // Avoid duplicates
    if (booksId[book.key] !== undefined) continue
    const newData = {
      id: id++,
      title: book.title,
      authors: book.authors[0].name,
      editionNumber: book.cover_edition_key,
      publishYear: book.first_publish_year,
      genre: book.subject
        .map(data => data.toLowerCase())
        .filter(sub => GENRES.includes(sub.toLowerCase()))
    }
    allBooks.push(newData)
  }
  booksData = allBooks
}

const createDate = input => {
  try {
    const [datePart, timePart] = input.trim().split(' ')
    const [year, month, day] = datePart.split('-')
    const [hours, minutes, seconds] = timePart.split(':')
    // Months in JavaScript are zero-indexed, so we subtract 1
    return new Date(year, month - 1, day, hours, minutes, seconds)
  } catch (e) {
    return -1
  }
}

const MainController = {
  getGenre: async (req, res) => {
    try {
      return res.send({ genre_list: GENRES, success: true })
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Please check your internet connection, otherwise Server Error'
      })
    }
  },
  getBooks: async (req, res) => {
    try {
      if (booksData.length === 0) await fetchBooks()
      const { genre, author, title } = req.query
      let books = booksData
      if (genre) {
        books = books.filter(book => book.genre.includes(genre.toLowerCase()))
      }
      if (author) {
        books = books.filter(book =>
          book.authors.includes(author.toLowerCase())
        )
      }
      if (title) {
        books = books.filter(book => book.title.includes(title.toLowerCase()))
      }
      res.send({
        genre: genre ?? 'all',
        title: title ?? 'all',
        author: author ?? 'all',
        books,
        success: true
      })
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Please check your internet connection, otherwise Server Error'
      })
    }
  },
  getSchedule: async (req, res) => {
    const date = new Date()
    // Return pickup schedules greater than now
    return res.send({
      schedule_list: BOOK_SCHEDULE.filter(
        schedule => schedule.pickup_schedule > date
      ).map(schedule => ({
        ...schedule,
        pickup_schedule: schedule.pickup_schedule.toLocaleString()
      })),
      success: true
    })
  },
  pickupSchedule: async (req, res) => {
    const { bookId, time } = req.body
    if (!bookId || !time) {
      return res
        .status(400)
        .send({ success: false, message: 'Payload Incorrect' })
    }

    const scheduledTime = createDate(time)
    // Check valid date
    if (scheduledTime === -1) {
      return res.status(400).send({
        success: false,
        message: 'Date format Incorrect, please format [YYYY-mm-dd H:i:s]'
      })
    }
    if (new Date() >= scheduledTime) {
      return res.status(400).send({
        success: false,
        message: 'Please Input Date greater than Now'
      })
    }

    if (booksData.length === 0) await fetchBooks()
    const indexBook = booksData.findIndex(data => data.id === +bookId)
    if (indexBook === -1) {
      return res.status(404).send('Book not found')
    }
    const book = booksData[indexBook]
    const appointment = {
      id: uuidv4(),
      book_id: book.id,
      book_title: book.title,
      book_authors: book.authors,
      book_editionNumber: book.editionNumber,
      book_publishYear: book.publishYear,
      pickup_schedule: scheduledTime
    }
    BOOK_SCHEDULE.push(appointment)
    return res.send({
      success: true,
      message: 'Schedule successfully added',
      appointment_info: {
        ...appointment,
        pickup_schedule: scheduledTime.toLocaleString()
      }
    })
  }
}

module.exports = MainController
