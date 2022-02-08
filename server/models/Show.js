const { Schema } = require("mongoose");

const showSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  //from tvMaze API after show is first added
  tvMazeId: {
    type: String,
    required: true,
  },
  watchStatus: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  image: {
    type: String,
  },
  episodes: [],
});

module.exports = showSchema;
