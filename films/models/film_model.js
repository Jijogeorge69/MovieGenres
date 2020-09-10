const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FilmSchema = new Schema({ name: String,rating: Number });

module.exports = mongoose.model("Film", FilmSchema)
