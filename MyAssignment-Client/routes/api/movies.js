const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const uuid = require('uuid');
const Movie = require('../../models/movie.js');

const router = express.Router();

const omdbApiKey = 'de75dbbf';
const tmdbApiKey = 'e9db68dfd8582eaecac57ec915ac1559';

mongoose
  .connect(
    'mongodb+srv://ChuahYiHern:doingdb@cluster0-nvgpo.mongodb.net/movies?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Mongodb connected...');
  });

// Create Movie
router.post('/', (req, res) => {
  console.log('In post movie function');

  if (req.body.title === '') {
    req.flash('error', 'Please enter Movie Title!');
    res.redirect('/');
    return;
  }
  const { title } = req.body;

  axios
    .all([
      axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${omdbApiKey}`),
      axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${title}`
      ),
    ])
    .then(respond => {
      let hasMovie = false;
      for (let i = 0; i < Object.keys(respond[1].data.results).length; i++) {
        if (respond[0].data.Title === respond[1].data.results[i].title) {
          hasMovie = true;
          const movie = new Movie({
            id: uuid.v4(),
            title: respond[0].data.Title,
            year: respond[0].data.Year,
            runtime: respond[0].data.Runtime,
            released: respond[0].data.Released,
            poster: respond[0].data.Poster,
            vote_count: respond[1].data.results[i].vote_count,
            vote_average: respond[1].data.results[i].vote_average,
          });
          movie
            .save()
            .then(() => {
              req.flash('success', 'Movie Successfully Added!');
              res.redirect('/');
            })
            .catch(error => {
              console.log(error);
            });
          break;
        }
      }

      if (!hasMovie) {
        req.flash('error', 'Movie not found!');
        res.redirect('/');
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// Delete Movie
router.post('/delete/:id', (req, res) => {
  console.log('In delete movie function');

  Movie.deleteOne({ id: req.params.id })
    .then(() => {
      req.flash('success', 'Movie Successfully Deleted!');
      res.redirect('/');
    })
    .catch(() => {
      req.flash('error', 'Delete Movie Unsuccessful!');
      res.redirect('/');
    });
});

module.exports = router;
