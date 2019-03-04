const express = require('express');
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Recipe = require('./models/recipe')
const User = require('./models/user')
const Ingredient = require('./models/ingredient')


const app = express();
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({ 
    schema: buildSchema(`
        type Recipe {
            _id: ID!
            name: String!
            description: String
            ingredients: [String!]!
            directions: [String!]!
            time: Int
            rating: Float
        }

        type User {
            _id: ID!
            email: String!
            password: String
            inventory: [String]
        }

        type Ingredient {
            _id: ID!
            name: String! 
            amount: Float!
            unit: String!
        }

        input RecipeInput {
            name: String!
            description: String
            ingredients: [String!]!
            directions: [String!]!
            time: Int
            rating: Float
        }

        input UserInput {
            email: String!
            password: String!
        }

        input IngredientInput {
            name: String!
            amount: Float!
            unit: String!
        }

        type RootQuery {
            recipes: [Recipe!]!
            users: [User!]!
            ingredients: [Ingredient!]!
        }

        type RootMutation{
            createRecipe(recipeInput: RecipeInput): Recipe
            createUser(userInput: UserInput): User
            createIngredient(ingredientInput: IngredientInput): Ingredient
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `), 
    rootValue: {
        recipes: () => {
            return Recipe.find()
                .then(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe._doc }
                    });
                })
                .catch(err => {
                    throw err;
                });
        },
        users: () => {
            return User.find()
                .then(users => {
                    return users.map(user => {
                        return { ...user._doc }
                    });
                })
                .catch(err => {
                    throw err;
                });
        },
        ingredients: () => {
            return Ingredient.find()
                .then(ingredients => {
                    return ingredients.map(ingredient => {
                        return { ...ingredient._doc }
                    });
                })
                .catch(err => {
                    throw err;
                });
        },
        createRecipe: (args) => {
            const recipe = new Recipe({
                name: args.recipeInput.name,
                description: args.recipeInput.description,
                ingredients: args.recipeInput.ingredients,
                directions: args.recipeInput.directions,
                time: args.recipeInput.time, 
                rating: +args.recipeInput.rating
            });
            return recipe
                .save()
                .then(result => {
                    return { ...result._doc };
                })
                .catch(err => {
                    throw err;
                });
        },
        createUser: (args) => {
            return User.findOne({email: args.userInput.email})
            .then(user => {
                if (user) {
                    throw new Error('Email already in use')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(
                hashedPassword => {  
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword, 
                        inventory: args.userInput.inventory,
                    });
                    return user.save();
                })
            .then(result => {
                return { ...result._doc, password: null };})
            .catch(err => {
                throw err;
            })
            
        },
        createIngredient: (args) => {
            const ingredient = new Ingredient({
                name: args.ingredientInput.name,
                amount: args.ingredientInput.amount,
                unit: args.ingredientInput.unit,
            });
            return ingredient
                .save()
                .then(result => {
                    return { ...result._doc };
                })
                .catch(err => {
                    throw err;
                });
        }
    }, 
    graphiql: true
}))

mongoose.connect('mongodb+srv://chive:WxOe3jPwS0oAPx1K@cluster0-ugvid.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }).then(
    () => app.listen(3000)
).catch(
    (err => console.log(err))
);

