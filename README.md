# Upskill

A MERN stack web application to enroll into online courses

## Tech Stack
1. Node.js
2. Express.js
3. MongoDb
4. React.js

## Libraries

1. jsonwebtoken
2. bcrypt
3. dotenv
4. mongoose
5. cors
6. redux
7. react-router
8. axios
9. chakra-ui

### Installation

```
git clone https://github.com/<USERNAME>/Upskill.git
cd Upskill
npm install
```
#### Run backend development server

Add a `.env` file to server directory with following contents
```
DB_STRING=database connection string from mongodb atlas
DB_PASSWORD=database password
DB_NAME= database to be created
JWT_SECRET=secret key to sign json web token
JWT_EXPIRY=jwt token expiry (eg: 1d, 30d etc..)
```
```
npm run server
```

#### Run client development server
```
npm run client
```
This will open the local development server at http://localhost:300.


## DB Models
```
user - user details
course - course details
catalog - user's enrolled courses
```

## APIs
```
SIGNUP - POST /auth/signup
SIGNIN - POST /auth/signin
GET LOGGEDIN USER - GET /auth/user

GET ALL COURSES - GET /course

CREATE COURSE - POST /course
GET COURSE BY ID - GET /course/:id
UPDATE COURSE - PUT /course/:id
DELETE COURSE - DELETE /course/:id

GET CATALOG - GET /catalog
ADD COURSE TO CATALOG - POST /catalog/:id
REMOVE COURSE FROM CATALOG - DELETE /catalog/:id
```
