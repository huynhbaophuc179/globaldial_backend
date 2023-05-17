const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const nutrientSchema = new mongoose.Schema({
  attr_id: {
    type: Number,
    required: true,
    primary: true
  },
  unit: {
    type: String,
    required: true
  },
  usda_nutr_desc: {
    type: String,
  },
  usda_sr_order: {
    type: Number,
  },
  api_name: {
    type: String,
  },
  fda_daily_value: {
    type: Number,
  },
  usda_tag: {
    type: String,
  },
  name: {
    type: String,
  }
},  { collection: "nutrition" });

module.exports = mongoose.model('nutrition', nutrientSchema);
