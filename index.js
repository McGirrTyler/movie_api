const mongoose = require("mongoose");
const Models = require("./models.js");

//Schema Import
const Movies = Models.Movie;
const Users = Models.User;

//Testing Purposes
/* mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); */

mongoose.connect(process.env.CONNECTION_URI, {
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
const { check, validationResult } = require("express-validator");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set-Up, Add once frontend is complete
const cors = require("cors");
let allowedOrigins = []; //Add Frontend Website When Ready
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        //Message For UnAuthorized Requests
        let message =
          "The CORS policy for this application doesn't allow access from origin" +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth")(app);
const passport = require("passport");
const { session } = require("passport");
const { json } = require("body-parser");
require("./passport");

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

//Log Sheet
app.use(morgan("combined", { stream: accessLogStream })); // Morgan default timestamp

app.get("/", (req, res) => {
  res.send("myFlix Movies API - By Bryan McGirr");
});

// MOVIES REQUESTS

//All Movies
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Search by Title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Search by Genres
app.get(
  "/movies/genre/:Genres",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ Genres: req.params.Genres })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Search by Director
app.get(
  "/movies/director/:Director",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ Director: req.params.Director })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET by Writer
app.get(
  //Edit
  "/movies/writer/:Writers", //Investigate why writer works for all BUT Anthony and Joe Russo
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ Writers: req.params.Writers })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
// Search by Actor
app.get(
  "/movies/actor/:TopActors",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ TopActors: req.params.TopActors })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Search by Rating
app.get(
  //Edit
  "/movies/rating/:Rating",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Null
    Movies.find({ Rating: req.params.Rating })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Create New Movie DEV ONLY
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
/* app.post(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
            ReleaseYear: req.body.ReleaseYear,
            ImagePath: req.body.ImagePath,
            Featured: req.body.Featured,
            CinematicUniverse: req.body.CinematicUniverse,
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
  }
); */

// Search Cinematic Universes
app.get(
  "/movies/universe/:CinematicUniverse",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ CinematicUniverse: req.params.CinematicUniverse })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Search by Release Year
app.get(
  "/movies/year/:ReleaseYear",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ ReleaseYear: req.params.ReleaseYear })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//DUAL REQUESTS

//Search by Genre & Rating
app.get(
  "/movies/genres/:Genres/rating/:Rating",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ Genres: req.params.Genres, Rating: req.params.Rating })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// /* JSON Format
//   {
//     Title: String, REQUIRED
//       Description: String, REQUIRED
//       Genres: [Array],
//       Director: [String],
//       Writers: [Array],
//       TopActors: [Array], REQUIRED
//       Rating: String, REQUIRED
//       Runtime: String,
//       ImagePath, String,
//       Featured: Boolean
//   }*/

// //Update Movies by Title DEV ONLY
app.put(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOneAndUpdate(
      { Title: req.params.Title },
      {
        $set: {
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
  }
);

// Delete code for special occasions DEV ONLY
// app.delete("/movies/:Title", (req, res) => {
//   Movies.findOneAndRemove({ Title: req.params.Title })
//     .then((movie) => {
//       if (!movie) {
//         res.status(400).send(req.params.Title + " was not found");
//       } else {
//         res.status(200).send(req.params.Title + " was deleted.");
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });

// USERS

//All Users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Search by Username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//

// User Registration
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5, max: 12 }),
    check("Username", "Username is required").isAlphanumeric(),
    check("Password", "Password is required").isLength({ min: 8 }),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // Validation Check
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // Password Auth
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res
            .status(400)
            .send(req.body.Username + "This Username already exists!");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
  }
);

//Update User info by Username
/* JSON FORMATE
{
  Username: String, REQUIRED
  Password: String, REQUIRED
  Email: String, REQUIRED
  Birthday: Date
}*/
app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5, max: 12 }),
    check("Username", "Username is required").isAlphanumeric(),
    check("Password", "Password is required").isLength({ min: 8 }),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // Validation Check
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    passport.authenticate("jwt", { session: false }),
      (req, res) => {
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
      };
  }
);

//Add Favorite Movies
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// User Deregister
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error!");
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
