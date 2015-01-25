var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: { type : String , unique : true, required : true, dropDups: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
});

UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
     ret.session_id = ret._id;
     delete ret._id;
     delete ret.__v;
  }
});

mongoose.model('User', UserSchema);