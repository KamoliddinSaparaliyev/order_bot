const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Meal = require('./meal.model')

const OrderSchema = new Schema(
    {
        is_deleted: {
            type: Boolean,
            default: false,
        },

        telegramId: {
            type: String,
            required: true,
        },
        meals: {
            type: [
                {
                    count: {
                        type: Number,
                        required: true,
                    },
                    meal: {
                        type: Schema.Types.ObjectId,
                        ref: 'meal',
                        required: true,
                    },
                },
            ],
            default: [],
        },
        status: {
            type: String,
            enum: ['waiting', 'done'],
            default: 'waiting',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        versionKey: false,
    }
)

OrderSchema.virtual('user', {
    ref: 'user',
    localField: 'telegramId',
    foreignField: 'user_id',
    justOne: true,
})

OrderSchema.methods.totalPrice = () =>
    this.meals.reduce((acc, meal) => acc + meal.count * meal.meal.price, 0)

const Order = mongoose.model('orders', OrderSchema)
module.exports = Order
