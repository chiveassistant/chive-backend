import { makeExecutableSchema } from "graphql-tools";

export const typeDefs = `
  type Ingredient {
    _id: ID!
    name: String! 
    amount: Float!
    unit: String!
  }

  input IngredientInput {
    name: String!
    amount: Float!
    unit: String!
  }
`;

export const resolvers = {};
