const mongoose = require('mongoose');
const watchlistItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});
const Watchlist = mongoose.model('Watchlist', watchlistItemSchema);
module.exports = Watchlist;
