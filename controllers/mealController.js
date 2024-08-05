const mongoose = require('mongoose')

require('../models/meal.model')

const Meal = mongoose.model('meal')

class MealController {
    async findMealById(id) {
        return await Meal.findOne({ _id: id })
    }

    async findMealsByCategory(category) {
        return await Meal.find({ category: category })
    }

    async inlineMealKeyboard(categoryId) {
        const meals = await Meal.find({ category: categoryId })

        const keyBoard = meals.map((m) => [
            {
                text: m.name,
                callback_data: JSON.stringify({
                    t: 'meal',
                    m: m._id,
                }),
            },
        ])

        return keyBoard
    }
}

module.exports = new MealController()
