const express = require('express');
const {
  register,
  login,
  glogin,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  generatePassword, userExist
} = require('../controllers/auth');

const router = express.Router();

const { protect, updatePassword } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/glogin', glogin);
router.post('/check/user', userExist);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, generatePassword, updateDetails);
router.put('/updateprofile', protect, updatePassword, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
