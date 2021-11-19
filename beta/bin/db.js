var mongoose = require('mongoose');

var mongoDB = 'mongodb+srv://admin:%40%40Gr33nw00d!!@cluster0.zx3h8.mongodb.net/Marketplace?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;

/*var db = require('../db');

module.exports = function() {

  //Create Facebook Marketplace table
  db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS fb-marketplace ( \
      fbid INTEGER UNIQUE, \
      fbcatid INTEGER, \
      name TEXT, \
      price TEXT, \
      city TEXT, \
      state TEXT, \
      datescan TEXT \
    )");
  });

  //db.close();
};
*/