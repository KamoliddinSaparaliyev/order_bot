const mongoose = require('mongoose')

require('../models/category.model')

const Category = mongoose.model('category')

class CategoryController {
    async findCategoryById(category) {
        return await Category.findOne({ _id: category }).populate('meals')
    }

    async listCategory(category) {
        return await Category.find()
    }

    async findCategoryByName(name) {
        return await Category.findOne({ name: name })
    }

    async replyCategoryKeyboard() {
        const categories = await Category.find({})

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
