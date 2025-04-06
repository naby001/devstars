import { User } from "../models/User.js";

export const swipe= async (req, res) => {
    const { userId, movieId, liked } = req.body;
    console.log(req.body);
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Update liked or disliked list
      if (liked) {
        if (!user.likedMovies?.includes(movieId)) {
          user.likedMovies.push(movieId);
        }
      } else {
        if (!user.dislikedMovies?.includes(movieId)) {
          user.dislikedMovies.push(movieId);
        }
      }
  
      // Get embeddings of liked movies
      const likedMovies = await Movie.find({ _id: { $in: user.likedMovies } });
      const embeddings = likedMovies.map((movie) => movie.embedding);
  
      // Update user context vector
      const contextVector = averageEmbeddings(embeddings);
      user.contextVector = contextVector;
  
      await user.save();
  
      res.status(200).json({ message: 'Swipe recorded', contextVector });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };