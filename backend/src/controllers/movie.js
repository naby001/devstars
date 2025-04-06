import Movie from "../models/Movie.js";
import Playlist from "../models/Playlist.js";
import Uniswipe from "../models/Uniswipe.js";
import { User } from "../models/User.js";

export const swipe= async (req, res) => {
    const { userId, movieId, liked } = req.body;
    console.log(req.body);
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (liked) {
        if (!user.liked) {
          user.liked = []; // initialize if undefined
        }
      
        if (!user.liked.includes(movieId)) {
          user.liked.push(movieId);
          console.log(user.liked)
        }
      } else {
        if (!user.disliked) {
          user.disliked = []; // initialize if undefined
        }
      
        if (!user.disliked.includes(movieId)) {
          user.disliked.push(movieId);
          console.log(user.disliked)
        }
      }
  
    //   // Get embeddings of liked movies
    const likedMovieIds = user.liked; // this contains 'movieid' values, not MongoDB _id

    const likedMovies = await Movie.find({ movieid: { $in: likedMovieIds } });
      const embeddings = likedMovies.map((movie) => movie.embedding);
  
    //   // Update user context vector
      const contextVector = averageEmbeddings(embeddings);
      user.contextVector = contextVector;
      console.log(embeddings)
      const newuser=await user.save();
      const newunientry= new Uniswipe({
        uni:user.university,
        liked:movieId
      });
      await newunientry.save();
    console.log(newuser);
      res.status(200).json({ message: 'Swipe recorded' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  function averageEmbeddings(vectors) {
    if (vectors.length === 0) return [];
  
    const length = vectors[0].length;
    const sum = new Array(length).fill(0);
  
    vectors.forEach(vec => {
      vec.forEach((val, i) => {
        sum[i] += val;
      });
    });
  
    return sum.map(val => val / vectors.length);
  }

  export function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
    return dotProduct / (magnitudeA * magnitudeB);
  }
  
  export const getRecommendations = async (req, res) => {
    const { userId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user ) {
        return res.status(400).json({ message: "No preference data available" });
      }
      console.log(user);
     if(user.contextVector.length===0){
        const movies=await Movie.find({});
        console.log("h");
        return res.status(200).json(movies);   
     }
      // Exclude liked/disliked movies
      const excludedIds = [...(user.liked || []), ...(user.disliked || [])];
  
      // Get all movies except the ones already swiped
      const candidateMovies = await Movie.find({
        movieid: { $nin: excludedIds },
        embedding: { $exists: true, $ne: [] }
      });
  
      // Compute cosine similarity between user.contextVector and each movie
      const recommendations = candidateMovies.map(movie => {
        const similarity = cosineSimilarity(user.contextVector, movie.embedding);
        return { movie, similarity };
      });
  
      // Sort by similarity
      recommendations.sort((a, b) => b.similarity - a.similarity);
  
      // Return top N
      const topRecommendations = recommendations.slice(0, 10).map(r => r.movie);
    console.log(topRecommendations)
      res.status(200).json(topRecommendations);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  
export const getPlaylistsOfUser = async (req, res) => {
    const { userId } = req.body;
     console.log(req.body);
    try {
      const playlists = await Playlist.find({ userId }).populate('movieIds');
  
      res.status(200).json({ playlists });
    } catch (error) {
      console.error('Error fetching playlists:', error);
      res.status(500).json({ message: 'Failed to fetch playlists' });
    }
  };

  export const addMovieToPlaylist = async (req, res) => {
    const { playlistId } = req.body;
    const { movieId } = req.body;
  
    try {
      const playlist = await Playlist.findById(playlistId);
  
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
  
      // Avoid adding duplicate movieId
      if (playlist.movieIds.includes(movieId)) {
        return res.status(400).json({ message: 'Movie already in playlist' });
      }
  
      playlist.movieIds.push(movieId);
      await playlist.save();
  
      res.status(200).json(playlist );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding movie to playlist' });
    }
  };