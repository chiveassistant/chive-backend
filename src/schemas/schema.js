import Ingredient from "./ingredient";
import Recipe from "./recipe";
import User from "./user";
import Links from "./ingredient";

import { mergeSchemas } from "graphql-tools";

export default mergeSchemas({
  schemas: [Ingredient, Recipe, User, Links]
});
