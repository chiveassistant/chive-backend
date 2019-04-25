import Recipe from "../models/recipe";

/**
 * TODO:
 * - make createRecipe take a RecipeInput instead of all the fields
 */

export const typeDefs = `
  extend type User {
    inventory: [Ingredient!]!
  }

  extend type Group {
    ingredients: [Ingredient!]!
  }

  extend type Recipe {
    ingredients: [Group!]!
  }

  extend type Query {
    recipeByIngredients(ingredients: [String]!): [Recipe!]!
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

/**
 * TODO:
 * - finish recipeByIngredients resolver
 * - finish createRecipe resolver
 */

export const resolvers = {
  Query: {
    recipeByIngredients: async (obj, { ingredients }, context, info) => {
      const ingredientsQuery = ingredients.map(ingredientName => {
        return { "ingredients.ingredients.name": RegExp(ingredientName) };
      });

      const results = await Recipe.find(
        {
          $and: ingredientsQuery
        },
        function(err, result) {
          if (err) {
            console.log("Query failed!");
          }
          if (result) {
            console.log("Result got got!");
          }
        }
      );

      return results;
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
