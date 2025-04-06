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
    //   const likedMovies = await Movie.find({ _id: { $in: user.likedMovies } });
    //   const embeddings = likedMovies.map((movie) => movie.embedding);
  
    //   // Update user context vector
    //   const contextVector = averageEmbeddings(embeddings);
    //   user.contextVector = contextVector;
  
      const newuser=await user.save();
    console.log(newuser);
      res.status(200).json({ message: 'Swipe recorded' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };