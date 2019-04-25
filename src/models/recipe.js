import { Schema, model } from "mongoose";
import { groupSchema } from "./group";

/**
 * TODO:
 * - update recipe schema to use objects instead of strings for ingredients
 */

export const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    ingredients: {
      type: [groupSchema],
      required: false
    },
    directions: {
      type: [String],
      required: false
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
      required: false
    },
    siteName: {
      type: String,
      required: false
    }
  },
  {
    collection: "recipes"
  }
);

export default model("Recipe", recipeSchema);
