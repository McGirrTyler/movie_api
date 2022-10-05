const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express"), //Import express and morgan.
  morgan = require("morgan"),
  fs = require("fs"), // fs and path import
  path = require("path"),
  bodyParser = require("body-parser"), // bodyParser and uuid Import
  uuid = require("uuid");
const { repeat } = require("lodash");
const { runInNewContext } = require("vm");
const req = require("express/lib/request");
const res = require("express/lib/response.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

//Get Requests
app.use(morgan("combined", { stream: accessLogStream })); // Morgan default timestamp

app.get("/", (req, res) => {
  res.send("myFlix Movies API");
});

// MOVIES REQUESTS

//GET List of Movies
app.get("/movies", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET Movie by Title
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET List of Movies by Genre
app.get("/movies/genre/:Genres", (req, res) => {
  //DOES NOT WORK
  Movies.find({ Genres: req.params.Genres })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET List of Movies by Director
app.get("/movies/director/:Director", (req, res) => {
  Movies.find({ Director: req.params.Director })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET List of Movies by Writer
app.get("/movies/writer/:Writers", (req, res) => {
  Movies.find({ Writers: req.params.Writers })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET List of Movies by Actor
app.get("/movies/actor/:TopActors", (req, res) => {
  //Null
  Movies.find({ TopActors: req.params.TopActors })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET List of Movies by Ratings
app.get("/movies/rating/:Ratings", (req, res) => {
  //Null
  Movies.find({ Ratings: req.params.Ratings })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Create Requests

//Create New Movie
/* JSON Format
    {
      ID: Integer,
      Title: String,
      Description: String,
      Genres: [Array],
      Director: [Array]
      Writers: [Array],
      TopActors: [Array],
      Rating: String,
      Runtime: String,
      ImagePath, String,
      Featured: Boolean
    }*/
app.post("/movies", (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res
          .status(400)
          .send(req.body.Title + "This movie is already in our database!");
      } else {
        Movies.create({
          Title: req.body.Title,
          Description: req.body.Description,
          Genres: req.body.Genres,
          Director: req.body.Director,
          Writers: req.body.Writers,
          TopActors: req.body.TopActors,
          Rating: req.body.Rating,
          Runtime: req.body.Runtime,
          ImagePath: req.body.ImagePath,
          Featured: req.body.Featured,
        })
          .then((newMovie) => {
            res.status(201).json(newMovie);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Upadate Requests
/* JSON Format
  {
    Title: String, REQUIRED
      Description: String, REQUIRED
      Genres: [Array],
      Director: [String],
      Writers: [Array],
      TopActors: [Array], REQUIRED
      Rating: String, REQUIRED
      Runtime: String,
      ImagePath, String,
      Featured: Boolean
  }*/

//Update Movies by Title
app.put("/movies/:Title", (req, res) => {
  Movies.findOneAndUpdate(
    { Title: req.params.Title },
    {
      $set: {
        Title: req.body.Title,
        Description: req.body.Description,
        Genres: req.body.Genres,
        Director: {
          Name: req.body.Name,
          Birthdate: req.body.Birthdate,
        },
        Writers: req.body.Writers,
        TopActors: req.body.TopActors,
        Rating: req.body.Rating,
        Runtime: req.body.Runtime,
        ImagePath: req.body.ImagePath,
        Featured: req.body.Featured,
      },
    },
    { new: true }, //Ensures updated document is returned
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedMovie);
      }
    }
  );
});

// USERS

//GET List of Users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET User by Username
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//CREATE Requests

//Create new User
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .send(req.body.Username + "This Username already exists!");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((newUser) => {
            res.status(201).json(newUser);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Update

//Update User info by Username
/* JSON FORMATE
{
  Username: String, REQUIRED
  Password: String, REQUIRED
  Email: String, REQUIRED
  Birthday: Date
}*/
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // Ensures updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//UPDATE Users Favorite Movies
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // Ensures Updated Document is Returened
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Delete

// DELETE User Deregister
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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
