import { Schema, model } from "mongoose";
import { ingredientSchema } from "./ingredient";

export const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: false
    },
    ingredients: {
      type: [ingredientSchema],
      required: false
    }
  },
  {
    collection: "ingredients"
  }
);

export default model("Ingredient", ingredientSchema);
