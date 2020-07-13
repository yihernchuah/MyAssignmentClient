const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const session = require('express-session');
const Movie = require('./models/movie.js');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// initialise session middleware - flash-express depends on it
app.use(
  session({
    secret: 'this is my long string that is use in http',
    resave: false,
    saveUninitialized: true,
  })
);

// Initialise the flash middleware
app.use(flash());

// Homepage Route
app.get('/', (req, res) => {
  console.log('In get movie function');

  Movie.find({}).then(respond => {
    const movies = JSON.parse(JSON.stringify(respond));
    res.render('index', {
      title: 'Movie App',
      movies,
    });
  });
});

// Movie API Routes
app.use('/api/movies', require('./routes/api/movies'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
