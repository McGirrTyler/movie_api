const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-JWT");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log(username + " " + password);
      Users.findOne({ Username: username }, (err, user) => {
        if (err) {
          console.log(err);
          return callback(err);
        }

        if (!user) {
          console.log("Incorrect Username");
          return callback(null, false, {
            message: "Incorrect Username or Password",
          });
        }

        if (!user.validatePassword(password)) {
          console.log("Incorrect Password");
          return callback(null, false, { message: "Incorrect Password." });
        }

        console.log("Finished");
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);
