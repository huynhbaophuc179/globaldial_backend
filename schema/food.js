const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  food_name: {
    type: String,
    required: true
  },
  brand_name: {
    type: String
  },
  serving_qty: {
    type: Number,
    required: true
  },
  serving_unit: {
    type: String,
    required: true
  },
  serving_weight_grams: {
    type: Number,
    required: true
  },
  nf_calories: {
    type: Number,
    required: true
  },
  nf_total_fat: {
    type: Number,

  },
  nf_saturated_fat: {
    type: Number,

  },
  nf_cholesterol: {
    type: Number,

  },
  nf_sodium: {
    type: Number,

  },
  nf_total_carbohydrate: {
    type: Number,

  },
  nf_dietary_fiber: {
    type: Number,

  },
  nf_sugars: {
    type: Number
  },
  nf_protein: {
    type: Number,

  },
  nf_potassium: {
    type: Number,

  },
  nf_p: {
    type: Number,

  },
  full_nutrients: [
    {
      attr_id: {
        type: Number,
        required: true,
        ref: "nutrition"
      },
      value: {
        type: Number,
        required: true
      }
    }
  ],
  tags: {
    item: String,
    measure: String,
    quantity: String,
    food_group: Number,
    tag_id: Number
  },
  photo: {
    thumb: String,
    highres: String,
  },
  isUserCreated: { type: String, default: false },
  userId: mongoose.Schema.Types.ObjectId,
}, { collection: "food" });

const food = mongoose.model("food", foodSchema);
module.exports = food;

