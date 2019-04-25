export const typeDefs = `
  type Ingredient {
    _id: ID!
    name: String! 
    quantity: String!
    unit: String!
  }

  input IngredientInput {
    name: String!
    quantity: String!
    unit: String!
  }
`;

export const resolvers = {};
