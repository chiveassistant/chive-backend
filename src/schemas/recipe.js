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
    directions: [String!]!
    rating: Float
    image: String
    source: String!
    siteName: String!
  }

  extend type Query {
    recipeByName(name: String!): [Recipe!]!
    recipeById(id: ID!): Recipe!
  }
`;

export const resolvers = {
  Query: {
    recipeByName: async (obj, { name }, { req, res }, info) => {
      const nameQuery = RegExp(name, "i");
      const results = await Recipe.find({ name: nameQuery });
      return results;
    },
    recipeById: async (obj, { id }, { req, res }, info) => {
      const result = await Recipe.findById(id);
      return result;
    }
  }
};
