import { Schema, model } from "mongoose";

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
