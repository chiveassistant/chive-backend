import { Schema, model } from "mongoose";

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    ingredients: {
      type: [String],
      required: true
    },
    directions: {
      type: [String],
      required: true
    },
    time: {
      type: Number,
      required: false
    },
    rating: {
      type: Number,
      required: false
    }
  },
  {
    collection: "recipes"
  }
);

export default model("Recipe", recipeSchema);
