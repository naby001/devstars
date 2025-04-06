import express from 'express';
import { swipe } from '../controllers/movie.js';

//import { addfriend, getGoogleAuthURL, handleGoogleCallback, login, signup, suggestFriends } from '../controllers/user.js';

const router = express.Router();
router.post('/swipe', swipe)
// Route for user signup

export default router;
