import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    inventory: {
      type: [String],
      required: true
    }
  },
  {
    collection: "users"
  }
);

export default model("User", userSchema);
