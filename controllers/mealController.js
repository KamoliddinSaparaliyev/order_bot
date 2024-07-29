const mongoose = require("mongoose");

require("../models/meal.model");

const Meal = mongoose.model("meal");

class MealController {
  // Поиск блюда по uuid
  async findMealById(id) {
    return await Meal.findOne({ _id: id });
  }

  // Поиск блюд по типу
  async findMealsByCategory(category) {
    return await Meal.find({ category: category });
  }

  // Формирование клавиатуры с типами блюд
  async inlineMealKeyboard(categoryId) {
    // получение полного списка блюд
    const meals = await Meal.find({ category: categoryId });

    const keyBoard = meals.map((m) => [
      {
        text: m.name,
        callback_data: JSON.stringify({
          t: "meal",
          m: m._id,
        }),
      },
    ]);
    
    return keyBoard;
  }
}

module.exports = new MealController();
