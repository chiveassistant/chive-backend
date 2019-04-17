import Recipe from "../models/recipe";

/**
 * TODO:
 * - extend Recipe in links to use Ingredient type for ingredients
 * - extend RecipeInput in links to use Ingredient type for ingredients
 */

export const typeDefs = `
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

  extend type Query {
    recipeByName(name: String!): [Recipe!]!
  }
`;

export const resolvers = {
  Query: {
    recipeByName: (obj, args, { req, res }, info) => {
      return Recipe.find({
        name: /args.name/i
      });
    }
  }
};
