import { merge } from "lodash";
import { makeExecutableSchema } from "graphql-tools";

import {
  typeDefs as Ingredient,
  resolvers as ingredientResolvers
} from "./ingredient";
import { typeDefs as Recipe, resolvers as recipeResolvers } from "./recipe";
import { typeDefs as User, resolvers as userResolvers } from "./user";
import { typeDefs as Links, resolvers as linksResolvers } from "./links";

const Query = `
  type Query {
    _empty: String
  }
`;

const Mutation = `
  type Mutation {
    _empty: String
  }
`;

export default makeExecutableSchema({
  typeDefs: [Query, Mutation, Ingredient, Recipe, User, Links],
  resolvers: merge(
    ingredientResolvers,
    recipeResolvers,
    userResolvers,
    linksResolvers
  )
});
