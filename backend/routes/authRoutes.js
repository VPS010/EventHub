const express = require('express');
const router = express.Router();
const { registerUser, loginUser, guestLogin,authCheck } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.get('/check',auth, authCheck);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/guest-login', guestLogin);

module.exports = router;