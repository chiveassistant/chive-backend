import { makeExecutableSchema } from "graphql-tools";

const typeDefs = `
  extend type User {
    inventory: [Ingredient!]!
  }

  type Query {
    recipeByIngredients(ingredients: [Ingredient!]!): [Recipe!]!
  }

  type Mutation {
    createRecipe(
      name: String!
      description: String
      ingredients: [Ingredient!]!
      directions: [String!]!
      time: Float
      rating: Float
    )
  }
`;

const resolvers = {
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

export default makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});
