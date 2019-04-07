import { makeExecutableSchema } from "graphql-tools";
import bcrypt from "bcryptjs";
import { jwtHash, passwordHash } from "../configuration/config";
import jwt from "jsonwebtoken";

import User from "../models/user";

const typeDefs = `
  type User {
    _id: ID!
    email: String!
    name: String!
  }

  type AuthData {
    _id: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Query {
    user(email: String!, token: String!): User
    login(email: String!, password: String!): AuthData
  }

  type Mutation {
    createUser(
      email: String!
      password: String!
      name: String!
    ): AuthData
  }
`;

const resolvers = {
  Query: {
    user: (obj, { email, token }, context, info) => {
      jwt.verify(token, config.jwtHash, function(err, decoded) {
        if (decoded.email !== email) {
          throw new Error("Not authorized to retrieve user");
        }
      });

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
    login: async (obj, { email, password }, context, info) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const authenticated = await bcrypt.compare(password, user.password);

      if (!authenticated) {
        throw new Error("Invalid credentials");
      }

      return {
        _id: user._id,
        token: jwt.sign({ email: user.email, time: Date.now() }, jwtHash, {
          expiresIn: "24h"
        }),
        tokenExpiration: 1
      };
    }
  },
  Mutation: {
    createUser: async (obj, args, context, info) => {
      const { email, password, name } = args;
      return User.findOne({ email: email })
        .then(user => {
          if (user) {
            throw new Error("Email already in use");
          }
          return bcrypt.hash(password, passwordHash);
        })
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            name: name,
            inventory: []
          });
          return user.save();
        })
        .then(user => {
          return {
            _id: user._id,
            token: jwt.sign({ email: user.email, time: Date.now() }, jwtHash, {
              expiresIn: "24h"
            }),
            tokenExpiration: 1
          };
        })
        .catch(err => {
          throw err;
        });
    }
  }
};

export default makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});
