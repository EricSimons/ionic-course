var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  preview_url: String,
  image_small: String,
  image_medium: String,
  image_large: String,
  open_url: String
});

SongSchema.set('toJSON', {
  transform: function (doc, ret, options) {
     ret.song_id = ret._id;
     delete ret._id;
     delete ret.__v;
  }
}); 

mongoose.model('Song', SongSchema);