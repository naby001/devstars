import mongoose from 'mongoose';

const uniswipeschema = new mongoose.Schema({
    uni:String,
    liked:String
});

const Uniswipe = mongoose.model('Uniswipe', uniswipeschema);

export default Uniswipe;
