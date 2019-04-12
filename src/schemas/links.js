import { makeExecutableSchema } from "graphql-tools";

export const typeDefs = `
  extend type User {
    inventory: [Ingredient!]!
  }

  extend type Query {
    recipeByIngredients(ingredients: [IngredientInput!]!): [Recipe!]!
  }

  extend type Mutation {
    createRecipe(
      name: String!
      description: String
      ingredients: [IngredientInput!]!
      directions: [String!]!
      time: Float
      rating: Float
    ): Recipe!
  }
`;

export const resolvers = {
  Query: {
    recipeByIngredients: (obj, args, context, info) => {
      return [];
    }
  },
  Mutation: {
    createRecipe: (
      obj,
      { name, description, ingredients, directions, time, rating },
      context,
      info
    ) => {
      console.log("name: ", name);
      console.log("description: ", description);
      console.log("ingredients: ", ingredients);
      console.log("directions: ", directions);
      console.log("time: ", time);
      console.log("rating: ", rating);
    }
  }
};
