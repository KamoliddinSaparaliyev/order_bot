const mongoose = require('mongoose')

require('../models/category.model')

const Category = mongoose.model('category')

class CategoryController {
    // Поиск блюда по uuid
    async findCategoryById(category) {
        return await Category.findOne({ _id: category }).populate('meals')
    }

    async listCategory(category) {
        return await Category.find()
    }

    async findCategoryByName(name) {
        return await Category.findOne({ name: name })
    }

    // Формирование клавиатуры с типами блюд
    async replyCategoryKeyboard() {
        // получение полного списка блюд
        const categories = await Category.find({})

        // categories reply keyboard

        const keyBoard = []

        categories.map((c, i) =>
            keyBoard.push([
                {
                    id: i,
                    text: '❇️ ' + c.name,
                },
            ])
        )

        keyBoard.push([
            {
                id: keyBoard.length + 1,
                text: '⬅️ Orqaga',
            },
        ])

        return keyBoard
    }
}

module.exports = new CategoryController()
