const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
        name: {
            type: String,
            required: true
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

categorySchema.virtual('meals', {
    ref: 'meals',
    localField: '_id',
    foreignField: 'category',
    justOne: false
})


mongoose.model('category', categorySchema)