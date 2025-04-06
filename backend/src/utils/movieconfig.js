import dotenv from 'dotenv';
import mongoose from 'mongoose';
import OpenAI from "openai";
import Movie from '../models/Movie.js';
import { movies } from '../../movielist.js';
import connectDB from '../config/db.js';
dotenv.config();
const Openai=process.env.OPENAI_KEY;

const openai = new OpenAI({apiKey:Openai});
export async function generateEmbedding(text) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding; // Returns a vector
  }

const run = async () => {
   const conn = await mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser:true,
        
  useUnifiedTopology:true,    });
  
  
  const limitedMovies = movies.slice(0, 60);

  for (const movie of limitedMovies) {
    try {
      const inputText = `${movie.description}\nGenres: ${movie.genres.join(', ')}\nInterests: ${movie.interests.join(', ')}`;

    
      const embedding = await generateEmbedding(inputText)
       console.log(movie.id);
      const newMovie = new Movie({
        movieid:movie.id,
        title: movie.title,
        description: movie.description,
        genres: movie.genres,
        interests: movie.interests,
        rating:movie.contentRating,
        embedding: embedding,
      });

      await newMovie.save();
      console.log(`✅ Saved movie: ${movie.primaryTitle}`);
    } catch (err) {
      console.error(`❌ Error processing movie ${movie.primaryTitle}:`, err.message);
    }
  }

  
};

run();
