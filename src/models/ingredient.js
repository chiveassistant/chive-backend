import { Schema, model } from "mongoose";

/**
 * TODO:
 * - see if there are enums for the unit?
 */

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  {
    collection: "ingredients"
  }
);

export default model("Ingredient", ingredientSchema);
