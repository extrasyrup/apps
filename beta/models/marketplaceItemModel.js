var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    fb_id: { type: Number, required: true },
    fb_cat_id: { type: Number },
    date_add: { type: Date },
    listed_name: { type: String, maxLength: 140 },
    price: { type: String, maxLength: 10 },
    city: { type: String, maxLength: 30 },
    state: { type: String, maxLength: 3 },
  }
);

// Virtual for ...
ItemSchema
    .virtual('name')
    .get(function () {
        return this.family_name + ', ' + this.first_name;
});

// Virtual for ...
ItemSchema.virtual('lifespan').get(function() {
    var lifetime_string = '';
    if (this.date_of_birth) {
        lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    }
    lifetime_string += ' - ';
    if (this.date_of_death) {
        lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    }
    return lifetime_string;
});

// Virtual for ...
ItemSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
});