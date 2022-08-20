const express = require("express"), //Import express and morgan.
  morgan = require("morgan"),
  fs = require("fs"), // fs and path import
  path = require("path");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

//Get Requests
app.use(morgan("combined", { stream: accessLogStream })); // Morgan default timestamp

app.get("/", (req, res) => {
  res.send("Welcome to my movie list!");
});

app.use("/documentation.html", express.static("movie_api"));

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/secreturl", (req, res) => {
  res.send("Hidden Content");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error!");
});

// Listen for requests
app.listen(8080, () => {
  console.log("App Listening on port 8080");
});

let topMovies = [
  //Genres will be replaced with id
  {
    title: "Avengers: Endgame",
    directors: "Anthony Russo, Joe Russo",
    year_of_release: "2019",
    parents_guide: "PG-13",
    runtime: "3hr and 1min",
    genres: "Action, Adventure, Drama",
  },
  {
    title: "Avatar",
    directors: "James Cameron",
    year_of_release: "2009",
    parents_guide: "PG-13",
    runtime: "2hr and 42min",
    genres: "Action, Adventure, Fantasy",
  },
  {
    title: "Titanic",
    directors: "James Cameron",
    year_of_release: "1997",
    parents_guide: "PG-13",
    runtime: "3hr 14min",
    genres: "Drama, Romance",
  },
  {
    title: "Star Wars: Episode VII - The Force Awakens",
    directors: "J.J. Abrams",
    year_of_release: "2015",
    parents_guide: "PG-15",
    runtime: "2hr 18min",
    genres: "Action, Adventure, Sci-Fi",
  },
  {
    title: "Avengers: Infinity War",
    directors: "Anthony Russo, Joe Russo",
    year_of_release: "2018",
    parents_guide: "PG-13",
    runtime: "2hr 29min",
    genres: "Action, Adventure, Sci-Fi",
  },
  {
    title: "Spider-Man: No Way Home",
    directors: "Jon Watts",
    year_of_release: "2021",
    parents_guide: "PG-13",
    runtime: "2hr 28min",
    genres: "Action, Adventure, Fantasy",
  },
  {
    title: "Jurrasic World",
    directors: "Colin Trevorrow",
    year_of_release: "2015",
    parents_guide: "PG-13",
    runtime: "2hr 14min",
    genres: "Action, Adventure, Sci-Fi",
  },
  {
    title: "The Lion King",
    directors: "Jon Favreau",
    year_of_release: "2019",
    parents_guide: "PG",
    runtime: "1hr 58min",
    genres: "Animation, Adventure, Drama",
  },
  {
    title: "The Avengers",
    directors: "Joss Whedon",
    year_of_release: "2012",
    parents_guide: "PG-13",
    runtime: "2hr 23min",
    genres: "Action, Adventure, Sci-Fi",
  },
  {
    title: "Furious 7",
    directors: "James Wan",
    year_of_release: "2015",
    parents_guide: "PG-13",
    runtime: "2hr 17min",
    genres: "Action, Crime, Thriller",
  },
];
