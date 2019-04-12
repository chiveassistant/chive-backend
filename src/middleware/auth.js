import { tokenHash, refreshHash } from "../configuration/config";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const createTokens = async user => {
  var token = "tokens aren't awaiting";
  var refreshToken = "tokens aren't awaiting";

  try {
    token = await jwt.sign(
      {
        user: {
          email: user.email,
          name: user.name
        }
      },
      tokenHash,
      {
        expiresIn: "1m"
      }
    );
  } catch (err) {}

  try {
    refreshToken = await jwt.sign(
      {
        user: {
          email: user.email,
          name: user.name,
          hashedPassword: user.password
        }
      },
      refreshHash,
      {
        expiresIn: "7d"
      }
    );
  } catch (err) {}

  return {
    token: token,
    refreshToken: refreshToken,
    user: user
  };
};

export const refreshTokens = async (token, refreshToken) => {
  var tokenVerified = false;
  var refreshTokenVerified = false;

  try {
    jwt.verify(token, tokenHash);
    tokenVerified = true;
  } catch (err) {}

  try {
    jwt.verify(refreshToken, refreshHash);
    refreshTokenVerified = true;
  } catch (err) {}

  if (!tokenVerified || !refreshTokenVerified) {
    return {};
  }

  let userEmail = false;

  try {
    const { user: tokenUser } = jwt.decode(token);
    userEmail = tokenUser.email;
    if (!userEmail) {
      return {};
    }
  } catch (err) {
    return {};
  }

  const databaseUser = await User.findOne({ email: userEmail });

  if (!databaseUser) {
    return {};
  }

  try {
    const { user: refreshUser } = jwt.decode(refreshToken);
    if (refreshUser.hashedPassword !== databaseUser.password) {
      return {};
    }
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(databaseUser);

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: databaseUser
  };
};
