const express = require("express"), //Import express and morgan.
  morgan = require("morgan"),
  fs = require("fs"), // fs and path import
  path = require("path"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const { repeat } = require("lodash");

const app = express();

app.use(bodyParser.json());

let movies = [
  //Genres will be replaced with id
  {
    title: "Avengers: Endgame",
    director: "Anthony Russo, Joe Russo",
    year: "2019",
    parents_guide: "PG-13",
    runtime: "3hr and 1min",
    genres: "Action, Adventure, Drama",
  },
  {
    title: "Avatar",
    director: "James Cameron",
    year: "2009",
    parents_guide: "PG-13",
    runtime: "2hr and 42min",
    genres: "Action, Adventure, Fantasy",
  },
  {
    title: "Titanic",
    director: "James Cameron",
    year: "1997",
    parents_guide: "PG-13",
    runtime: "3hr 14min",
    genres: "Drama, Romance",
  },
  {
    title: "Star Wars: Episode VII - The Force Awakens",
    director: "J.J. Abrams",
    year: "2015",
    parents_guide: "PG-15",
    runtime: "2hr 18min",
    genres: "Action, Adventure, Sci-Fi",
  },
  {
    title: "Avengers: Infinity War",
    director: "Anthony Russo, Joe Russo",
    year: "2018",
    parents_guide: "PG-13",
    runtime: "2hr 29min",
    genres: "Action, Adventure, Sci-Fi",
  },
  {
    title: "Spider-Man: No Way Home",
    director: "Jon Watts",
    year: "2021",
    parents_guide: "PG-13",
    runtime: "2hr 28min",
    genres: "Action, Adventure, Fantasy",
  },
  {
    title: "Jurrasic World",
    director: "Colin Trevorrow",
    year: "2015",
    parents_guide: "PG-13",
    runtime: "2hr 14min",
    genres: "Action, Adventure, Sci-Fi",
  },
  {
    title: "The Lion King",
    director: "Jon Favreau",
    year: "2019",
    parents_guide: "PG",
    runtime: "1hr 58min",
    genres: "Animation, Adventure, Drama",
  },
  {
    title: "The Avengers",
    director: "Joss Whedon",
    year: "2012",
    parents_guide: "PG-13",
    runtime: "2hr 23min",
    genres: "Action, Adventure, Sci-Fi",
  },
  {
    title: "Furious 7",
    director: "James Wan",
    year: "2015",
    parents_guide: "PG-13",
    runtime: "2hr 17min",
    genres: "Action, Crime, Thriller",
  },
];

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

//Get Requests
app.use(morgan("combined", { stream: accessLogStream })); // Morgan default timestamp

app.get("/", (req, res) => {
  res.send("Welcome to my movie list!");
});

// Get data on movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Get data on a single movie by title
app.get("/movies/title/:title", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});


// Need to add code for multiple returns


// Get data on movies within a certain year
app.get("/movies/year/:year", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.year === req.params.year;
    })
  );
});

// Get data movies from a certain director
app.get("/movies/director/:director", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.director === req.params.director;
    })
  );
});

// Get data on movies with certain Parent Guide
app.get("/movies/parentsguide/:parents_guide", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.parents_guide === req.params.parents_guide;
    })
  );
});

// Get data on movies within a certain genre
app.get("/movies/genres/:genres", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.genres === req.params.genres;
    })
  );
});

// DUAL REQUESTS

// data on movies from a certain year and director
app.get("/movies/director/year/:director/:year", (req, res) => {
  res.json(
    movies.find(
      (movie) => {
        return movie.director === req.params.director;
      },
      { return: movies.year === req.params.year }
    )
  );
});

// Data on movies from a certain year and genre
app.get("/movies/year/genres/:year/:genres", (req, res) => {
  res.json(
    movies.find(
      (movie) => {
        return movie.year === req.params.year;
      },
      { return: movies.genres === req.params.genres }
    )
  );
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error!");
});

// Listen for requests
app.listen(8080, () => {
  console.log("App Listening on port 8080");
});
