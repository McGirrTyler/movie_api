const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genres: [String],
  Director: [String],
  Writers: [String],
  TopActors: [{ type: String, required: true }],
  Rating: { type: String, required: true },
  Runtime: String,
  ReleaseYear: String,
  ImagePath: String,
  Featured: Boolean,
  CinematicUniverse: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Universes" },
  ],
});

let universesSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Studio: { type: String, required: true },
  Movies: [{ type: mongoose.Schema.Types.ObjectID, ref: "Movie" }],
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectID, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Universe = mongoose.model("Universe", universesSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Universe = Universe;

