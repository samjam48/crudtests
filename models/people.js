var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var peopleSchema = new Schema({
    name: {type: String, index: true, unique: true},
    age: {type: Number, required: true }
})

mongoose.model('people', peopleSchema)
