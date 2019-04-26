import { createWriteStream, unlinkSync, ensureDir } from "fs-extra";
import Upload from "../models/upload";
import { GraphQLUpload } from "graphql-upload";

const UPLOAD_DIR = "./storage/uploads";

export const typeDefs = `
  scalar Upload

  extend type Mutation {
    uploadImage(file: Upload!): User!
  }
`;

const storeFS = async (stream, userId) => {
  const filename = `${userId}.png`;
  const path = `${UPLOAD_DIR}/${filename}`;

  try {
    await ensureDir(UPLOAD_DIR);
  } catch (err) {
    console.error(`Error ensuring upload dir: ${UPLOAD_DIR}`, err);
  }

  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        if (stream.truncated)
          // Delete the truncated file.
          unlinkSync(path);
        reject(error);
      })
      .pipe(createWriteStream(path))
      .on("error", error => reject(error))
      .on("finish", () => resolve({ path, filename }))
  );
};

const processUpload = async (file, user) => {
  const { createReadStream } = await file;
  const stream = createReadStream();
  const { path, filename } = await storeFS(stream, user._id);

  const uploadDB = {
    filename: filename,
    mimetype: "image/png", // converting all pics to pngs
    path: path
  };

  const upload = new Upload(uploadDB);

  user.profilePicture = filename;

  try {
    await upload.save();
  } catch (err) {
    console.error("Upload File Error: ", err);
  }

  try {
    await user.save();
  } catch (err) {
    console.error("Upload User Error: ", err);
    console.info("Upload User Error User: ", user);
  }

  return user;
};

export const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    uploadImage: async (obj, { file: [file] }, { req, res }, info) => {
      if (!req.user) {
        throw new Error("Not logged in :(");
      }
      return await processUpload(file, req.user);
    }
  }
};
