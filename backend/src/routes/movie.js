import express from 'express';
import { addMovieToPlaylist, getPlaylistsOfUser, getRecommendations, swipe } from '../controllers/movie.js';

//import { addfriend, getGoogleAuthURL, handleGoogleCallback, login, signup, suggestFriends } from '../controllers/user.js';

const router = express.Router();
router.post('/swipe', swipe);
router.post('/getrecommend', getRecommendations);
router.post('/getplaylist', getPlaylistsOfUser);
router.post('/addtoplay', addMovieToPlaylist);
// Route for user signup

export default router;
