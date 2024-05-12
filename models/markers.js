const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);

const markerSchema = mongoose.Schema({
  
  nickname : String,
  city : String,
  latitude: Float, 
  longitude: Float, 
  
});

const Marker = mongoose.model('markers', markerSchema);

module.exports = Marker;






























