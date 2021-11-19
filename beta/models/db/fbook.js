var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FbookItemSchema = new Schema({
    fbId: { type: Number, ref: 'Item', required: true, unique: true },
    fbCatId: { type: Number, ref: 'Category' },
    listingTitle: { type: String },
    formattedPrice: { type: String },
    city: { type: String },
    state: { type: String },
    scanCount: { type: Number }
});

// Virtual for Fbook's URL
FbookItemSchema
.virtual('url')
.get(function () {
  return '/api/fbookitem/' + this._id;
});

//Export model
module.exports = mongoose.model('FbookItem', FbookItemSchema);