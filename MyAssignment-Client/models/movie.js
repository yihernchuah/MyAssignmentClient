const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create movie Schema & Model
const MovieSchema = new Schema({
  id: { type: String },
  title: { type: String },
  year: { type: Number },
  runtime: { type: String },
  released: { type: String },
  poster: { type: String },
  vote_count: { type: Number },
  vote_average: { type: Number },
});

const Movie = mongoose.model('movie', MovieSchema);
module.exports = Movie;
