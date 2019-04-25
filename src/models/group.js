import { Schema, model } from "mongoose";
import { ingredientSchema } from "./ingredient";

export const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: true
    },
    ingredients: {
      type: [ingredientSchema],
      required: true
    }
  },
  {
    collection: "ingredients"
  }
);

export default model("Ingredient", ingredientSchema);
