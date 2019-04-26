import { Schema, model, ObjectId } from "mongoose";
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
      type: String,
      required: false
    },
    inventory: {
      type: [ingredientSchema],
      required: true
    },
    favorites: {
      type: [ObjectId],
      required: true
    },
    groceryList: {
      type: [ObjectId],
      required: true
    }
  },
  {
    collection: "users"
  }
);

export default model("User", userSchema);
