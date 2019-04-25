import { Schema, model } from "mongoose";

export const uploadSchema = new Schema(
  {
    filename: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  {
    collection: "uploads"
  }
);

export default model("Upload", uploadSchema);
