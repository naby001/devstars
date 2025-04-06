import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    movieid: String,
  title: String,
  description: String,
  rating:String,
  genres: [String],
  interests: [String],
  embedding: [Number], // OpenAI embedding vector
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
