import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const playlistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  movieIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Movie',  // Reference to your Movie model
  }],
  user:[{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Playlist = model('Playlist', playlistSchema);
export default Playlist;
