const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    ingredients: {
        type: [String],
        required: true
    },
    directions: {
        type: [String],
        required: true
    },
    time: {
        type: Number,
        required: false
    },
    rating: {
        type: Number,
        required: false
    },
})

module.exports = mongoose.model('Recipe', recipeSchema);