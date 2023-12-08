for more detailed, read readme.markdown.
Simpler version installation:
1. npm install
2. npm test 
3. npm start
4. enjoy the apis

List Api:
1. Get List of Genre Book
Url: /api/genre
Method:GET 

2. Get All Books or Specified Book
Url: /api/books
Method: GET
Parameters (optional): `genre`, `author`, `title` . it's query parameter(?) 

3. Get Schedule Pick Up Book (filtered by date greater than now)
Url: /api/schedule
Method: GET

4. Add New Pickup Schedule
Url: /api/schedule
Method: POST
payload : {"bookId": "bookId from 2","time": date format("YYYY-mm-dd H:i:s")}
payload_type: json