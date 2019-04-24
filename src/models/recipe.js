import { Schema, model } from "mongoose";
import { ingredientSchema } from "./ingredient";

/**
 * TODO:
 * - update recipe schema to use objects instead of strings for ingredients
 */

export const recipeSchema = new Schema(
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
      type: [ingredientSchema],
      required: true
    },
    directions: {
      type: [String],
      required: true
    },
    rating: {
      type: Number,
      required: false
    },
    image: {
      type: Buffer,
      required: false
    },
    source: {
      type: String,
      required: true
    },
    siteName: {
      type: String,
      required: true
    }
  },
  {
    collection: "recipes"
  }
);

export default model("Recipe", recipeSchema);
