import { makeExecutableSchema } from "graphql-tools";
import Recipe from "../models/recipe";

const typeDefs = `
  type Recipe {
    _id: ID!
    name: String!
    description: String
    ingredients: [String!]!
    directions: [String!]!
    time: Int
    rating: Float
  }

  input RecipeInput {
    name: String!
    description: String
    ingredients: [String!]!
    directions: [String!]!
    time: Int
    rating: Float
  }

  type Query {
    recipeByName(name: String!): [Recipe!]!
  }
`;

const resolvers = {
  Query: {
    recipeByName: (obj, args, context, info) => {
      return Recipe.find({
        name: /args.name/i
      });
    }
  }
};

export default makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});
