import { Schema, model } from "mongoose";

/**
 * TODO:
 * - update recipe schema to use objects instead of strings for ingredients
 */

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
