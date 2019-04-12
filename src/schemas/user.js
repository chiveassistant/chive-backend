import bcrypt from "bcryptjs";
import { passwordHash } from "../configuration/config";

import User from "../models/user";
import { createTokens } from "../middleware/auth";

export const typeDefs = `
  type User {
    _id: ID!
    email: String!
    name: String!
  }

  extend type Query {
    user(email: String!, token: String!): User
    login(email: String!, password: String!): User
  }

  extend type Mutation {
    createUser(
      email: String!
      password: String!
      name: String!
    ): User
  }
`;

export const resolvers = {
  Query: {
    user: (obj, { email, token }, context, info) => {
      var user = User.findOne({ email: email });

      if (!user) {
        // this could potentially be a point to see if someone found our key because they have encoded the token with the right hash and are providing the right email with the token
        throw new Error("User not found");
      }

      return {
        _id: user._id,
        email: user.email,
        name: user.name
      };
    },
    login: async (obj, { email, password }, { req, res }, info) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const authenticated = await bcrypt.compare(password, user.password);

      if (!authenticated) {
        throw new Error("Invalid credentials");
      }

      const tokens = createTokens(user);

      res.cookie("token", tokens.token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true
      });

      res.cookie("refresh-token", tokens.refreshToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true
      });

      return {
        ...user,
        password: null
      };
    }
  },
  Mutation: {
    createUser: async (obj, { email, password, name }, { req, res }, info) => {
      var tempUser = await User.findOne({ email: email });

      if (tempUser) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(password, passwordHash);

      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        inventory: []
      });

      await user.save();

      const tokens = await createTokens(user);

      res.cookie("token", tokens.token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true
      });

      res.cookie("refresh-token", tokens.refreshToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true
      });

      user.password = null;

      return user;
    }
  }
};
