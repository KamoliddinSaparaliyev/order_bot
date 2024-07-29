const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MealSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String
    }
})

const Meal = mongoose.model('meal', MealSchema)
module.exports = Meal