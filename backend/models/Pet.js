const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Pet = mongoose.model(
  "Pet",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      image: {
        type: Array,
        required: true,
      },
      available: {
        type: Boolean,
        required: true,
      },
      user: Object,
      adpoter: Object,
    },
    { timestamps: true }
  )
);

module.exports = Pet;
