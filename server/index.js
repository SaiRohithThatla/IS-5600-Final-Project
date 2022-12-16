const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

// Use dotenv to parse content of .env files
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const authRouter = require('./routes/auth');
const courseRouter = require('./routes/courses');
const catalogRouter = require('./routes/catalog');

const app = express();

app.use(express.json());

// configure CORS origins that can access the server
// * mean all origins
app.use(
	cors({
		origin: '*',
	})
);

// Simple middleware to log incoming API requests
app.use('/api', (req, _, next) => {
	console.log(`API hit:: ${req.url}`);
	next();
});

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/course', courseRouter);
app.use('/api/catalog', catalogRouter);

// Serve static files requested by browser
const buildPath = path.resolve(__dirname, '..', 'build');
app.use(express.static(buildPath));

// Serve index.html from build directory
app.get('*', (req, res) => {
	console.log(`Static resource requested:: ${req.url}`);
	return res.sendFile(path.resolve(buildPath, 'index.html'), function (err) {
		res.status(500).send(err);
	});
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDb database though mongoose driver
const { DB_STRING, DB_PASSWORD, DB_NAME } = process.env;
const CONNECTION_STRING = DB_STRING.replace('<PASSWORD>', DB_PASSWORD);

mongoose
	.connect(CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: DB_NAME,
	})
	.then(() => {
		console.log('DB connected succesfully!');
		app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
	})
	.catch((err) => {
		console.log(err);
	});
