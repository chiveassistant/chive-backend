import bcrypt from "bcryptjs";
import { passwordHash } from "../configuration/config";

import User from "../models/user";
import { createToken } from "../middleware/auth";

export const typeDefs = `
  type User {
    _id: ID!
    email: String!
    name: String!
  }

  extend type Query {
    user(email: String!, token: String!): User
  }

  extend type Mutation {
    createUser(
      email: String!
      password: String!
      name: String!
    ): User
    login(email: String!, password: String!): User
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
    }
  },
  Mutation: {
    login: async (obj, { email, password }, { req, res }, info) => {
      var user = await User.findOne({ email: email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const authenticated = await bcrypt.compare(password, user.password);

      if (!authenticated) {
        throw new Error("Invalid credentials");
      }

      const { token, user } = await createToken(user);

      res.cookie("token", token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true
      });

      user.password = null;

      console.info("User successfully logged in: ", user.email);

      return user;
    },

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

      const { token } = await createToken(user);

      res.cookie("token", token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true
      });

      user.password = null;

      console.info("User successfully created: ", user.email);

      return user;
    }
  }
};
