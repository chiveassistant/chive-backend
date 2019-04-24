import { Schema, model } from "mongoose";
import { ingredientSchema } from "./ingredient";

/**
 * TODO:
 * - add grocery list to user obj
 */

export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profilePicture: {
      type: Buffer,
      required: false
    },
    inventory: {
      type: [ingredientSchema],
      required: true
    },
    favorites: {
      type: [Number],
      required: true
    },
    groceryList: {
      type: [Number],
      required: true
    }
  },
  {
    collection: "users"
  }
);

export default model("User", userSchema);
