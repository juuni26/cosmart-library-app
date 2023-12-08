# Library API for Cosmart

This documentation outlines the usage, installation, and details of the Library API for Cosmart. 

Author : *Junio Akarda*

##  Installation

1. **Installation**: Begin by installing the required dependencies. Run the following command in the terminal:

    ```bash
    npm install
    ```

2. **Start the API**: To start the API, use the following command:

    ```bash
    npm start
    ```

    For offline mode, use (default: linux):

    ```bash
    npm run start-offline
    ```

    On Windows, the command is:

    ```bash
    npm run start-offline-windows


    ```
    
    The difference is when running in online mode, route get /books will fetch directly from OpenLibrary API, while in offline mode, the route is retreving from the provided data (in case there is no internect connectivity).

3.   **Dependencies**:
        - [axios](https://www.npmjs.com/package/axios): For making HTTP requests.
        - [express](https://www.npmjs.com/package/express): For building the web application.
        - [uuid](https://www.npmjs.com/package/uuid): For generating unique identifiers.
        - [jest](https://www.npmjs.com/package/jest): For testing.

4. **Testing**:

    Run tests using the following command:

    ```bash
    npm test
    ```

## Application Flow (API)
### 1. Get List of Genre

- **Endpoint**: `/api/genre`
- **Method**: GET
- **Description**: Returns a list of available genres.
### Example Usage
- **Request**: `GET /getGenre`
- **Response**: `{ "genre_list": ["humor", "fantasy", "literature"], "success": true }`
---
### 2. Get All Books or Specified Book
- **Endpoint**: `/api/books`
- **Method**: GET
- **Parameters (optional)**: `genre`, `author`, `title`
- **Description**: Retrieve books with optional filters such as genre, author, and title.
### Example Usage
- **Request**: `GET /api/getBooks?genre=fantasy`
- **Response**: `{ "genre": "fantasy", "title": "all", "author": "all", "books": [...], "success": true }`
---
### 3. Get Schedule Pick Up (filtered by date greater than now)

- **Endpoint**: `/api/schedule`
- **Method**: GET
- **Description**: Retrieve pickup schedules for books.
### Example Usage
- **Request**: `GET /getSchedule`
- **Response**: `{ "schedule_list": [...], "success": true }`

--- 
### 4. Add New Pickup Schedule
- **Endpoint**: `/api/schedule`
- **Method**: POST
- **Payload**: `{ "bookId": bookId, "time": Date with Format('YYYY-mm-dd H:i:s' }`
- **Description**: Add a new pickup schedule for a book.
### Example Usage
- **Request**: `POST /api/schedule`
- **Payload**: `{ "bookId": 1, "time": "2023-12-31 14:30:00" }`
- **Payload_type**: `json`
- **Response**: `{ "success": true, "message": "Schedule successfully added", "appointment_info": {...} }`
---

Build with Node Js, 8 Desember 2023.