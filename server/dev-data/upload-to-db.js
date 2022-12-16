const Course = require('../models/course');
const User = require('../models/user');

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// MONGOOSE CONNECTION
const { DB_STRING, DB_PASSWORD, DB_NAME } = process.env;
const CONNECTION_STRING = DB_STRING.replace('<PASSWORD>', DB_PASSWORD);

async function upload() {
	await Course.deleteMany();
	const content = require('fs').readFileSync('./courses.json', { encoding: 'utf-8' });
	await Course.insertMany(JSON.parse(content));
	console.log('Courses added to DB!');
}

async function insertAdminUser() {
	const userExists = await User.findOne({ name: 'XXXXX' }); // Replace XXXXX with admin name
	if (userExists) {
		console.log('User already added to DB!');
		return;
	}
	await User.create({
		// add admin name, email and password fields
		role: 'ADMIN'
	});
	console.log('User added to DB!');
}

require('mongoose')
	.connect(CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: DB_NAME
	})
	.then(() => {
		console.log('DB connected succesfully!');
		// upload();
		// insertAdminUser();
	})
	.catch((err) => {
		console.log(err);
	});
