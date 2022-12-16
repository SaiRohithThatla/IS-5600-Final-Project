const express = require('express');

const { signUp, signIn, getLoggedUser, protect } = require('../controllers/auth');

const router = express.Router();

// AUTH ROUTES
router.post('/signup', signUp);
router.post('/signin', signIn);

// Use protect middleware to let only loggedin user access following routes
router.use(protect);

router.get('/user', getLoggedUser);

module.exports = router;
