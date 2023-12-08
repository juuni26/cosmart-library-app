const MainController = require('../src/controllers/mainController')

/* eslint-env jest */
describe('MainController', () => {
  describe('getGenre', () => {
    it('should return list of genres', async () => {
      const req = {}
      const sendMock = jest.fn()
      const res = { send: sendMock }

      await MainController.getGenre(req, res)

      expect(sendMock).toHaveBeenCalledWith({
        genre_list: ['humor', 'fantasy', 'literature'],
        success: true
      })
    })
  })

  describe('getBooks', () => {
    it('should return all books when no filters are provided', async () => {
      const req = { query: {} }
      const sendMock = jest.fn()
      const res = { send: sendMock }

      await MainController.getBooks(req, res)

      expect(sendMock).toHaveBeenCalled()
    })

    it('should return filtered books based on genre, author, and title', async () => {
      const req = {
        query: { genre: 'humor', author: 'Author1', title: 'Title1' }
      }
      const sendMock = jest.fn()
      const res = { send: sendMock }

      await MainController.getBooks(req, res)

      // Add assertions based on the expected behavior of filtering
      // Example: Check if the 'send' method was called with the expected filtered books
      expect(sendMock).toHaveBeenCalled()
      expect(sendMock.mock.calls[0][0].success).toBe(true)
    })

    // Add more test cases for different filtering scenarios
  })

  describe('getSchedule', () => {
    it('should return empty schedule when no appointments are present', async () => {
      const req = {}
      const sendMock = jest.fn()
      const res = { send: sendMock }

      await MainController.getSchedule(req, res)

      expect(sendMock).toHaveBeenCalledWith({
        schedule_list: [],
        success: true
      })
    })
  })

  describe('pickupSchedule', () => {
    it('should handle missing bookId or time and return status 400', async () => {
      const req = { body: {} }
      const res = {
        status: jest.fn(() => res),
        send: jest.fn()
      }

      await MainController.pickupSchedule(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Payload Incorrect'
      })
    })

    it('should handle invalid date format and return status 400', async () => {
      // Test the scenario where the date format in the payload is incorrect
      // Modify the 'time' value in the request body to an invalid format

      const req = { body: { bookId: 1, time: 'InvalidDateFormat' } }
      const res = {
        status: jest.fn(() => res),
        send: jest.fn()
      }

      await MainController.pickupSchedule(req, res)

      // Add assertions based on the expected behavior for an invalid date format
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Date format Incorrect, please format [YYYY-mm-dd H:i:s]'
      })
    })

    it('should handle pickup schedule in the past (must be greater than now) and return status 400', async () => {
      // Test the scenario where the pickup schedule is in the past
      // Modify the 'time' value in the request body to a past date

      const req = { body: { bookId: 1, time: '2020-01-01 12:00:00' } }
      const res = {
        status: jest.fn(() => res),
        send: jest.fn()
      }

      await MainController.pickupSchedule(req, res)

      // Add assertions based on the expected behavior for a pickup schedule in the past
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Please Input Date greater than Now'
      })
    })

    it('should handle missing book and return status 404', async () => {
      // Test the scenario where the specified bookId does not exist
      // Modify the 'bookId' value in the request body to a non-existing ID

      const req = { body: { bookId: 999, time: '2023-12-31 12:12:12' } }
      const res = {
        status: jest.fn(() => res),
        send: jest.fn()
      }

      await MainController.pickupSchedule(req, res)

      // Add assertions based on the expected behavior for a missing book
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith('Book not found')
    })

    it('should add a valid appointment and return status 200', async () => {
      // Test the scenario where a valid appointment is added
      // Modify the 'bookId' and 'time' values in the request body to valid values

      const req = { body: { bookId: 1, time: '2023-12-31 12:12:12' } }
      const res = {
        status: jest.fn(() => res),
        send: jest.fn()
      }

      await MainController.pickupSchedule(req, res)

      // Add assertions based on the expected behavior for adding a valid appointment
      // Example: Check if the 'send' method was called with the expected success message
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Schedule successfully added'
        })
      )
    })

    // Add more test cases for different scenarios related to picking up schedules
  })
})
