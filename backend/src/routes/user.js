import express from 'express';
import { googleLogin } from '../controllers/user.js';
//import { addfriend, getGoogleAuthURL, handleGoogleCallback, login, signup, suggestFriends } from '../controllers/user.js';

const router = express.Router();
router.post('/signup', googleLogin)
// Route for user signup

export default router;
