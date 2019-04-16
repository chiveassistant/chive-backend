import { tokenHash } from "../configuration/config";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const createToken = async user => {
  var token = null;

  try {
    token = await jwt.sign(
      {
        user: {
          email: user.email,
          name: user.name
        },
        expiration: Date.now() + 60 * 60 * 24 * 7
      },
      tokenHash,
      {
        expiresIn: "7d" // 7 days
      }
    );
  } catch (err) {
    console.log("Create token sign error: ", err);
    return {};
  }

  return {
    token: token,
    user: user
  };
};

export const refreshToken = async token => {
  try {
    await jwt.verify(token, tokenHash);
  } catch (err) {
    console.log("Refresh token verify error: ", err);
    return {};
  }

  let userEmail = null;

  try {
    var { user } = await jwt.decode(token);
    userEmail = user.email;
    if (!userEmail) throw new Error("User not found!");
  } catch (err) {
    console.log("Refresh token decode error: ", err);
    return {};
  }

  const databaseUser = await User.findOne({ email: userEmail });

  if (!databaseUser) return {};

  return await createToken(databaseUser);
};
