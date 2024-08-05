const cron = require('node-cron')
const Order = require('../models/order.model')

class OrderController {
    async addMeal(userId, mealId, count) {
        try {
            const query = {
                telegramId: userId,
                is_deleted: false,
                status: 'waiting',
            }
            let order = await Order.findOne(query)

            if (order) {
                const mealOrder = await Order.findOne({
                    ...query,
                    meals: { $elemMatch: { meal: mealId } },
                })

                if (mealOrder) {
                    if (mealOrder.meals[0].count === count) {
                        return 'Siz bu taomni buyurtirgansiz'
                    }
                    await Order.updateOne(
                        { ...query, 'meals.meal': mealId },
                        { $set: { 'meals.$.count': count } }
                    )
                    return "Buyurtmangizga qo'shilgan taomni sonini o'zgartirdingiz"
                } else {
                    order.meals.push({ meal: mealId, count })
                    await order.save()
                    return "Buyurtmangizga yangi taomni qo'shdingiz"
                }
            } else {
                order = new Order({
                    telegramId: userId,
                    meals: [{ meal: mealId, count }],
                })
                await order.save()
                return "Taom buyurtmangizga qo'shildi"
            }
        } catch (error) {
            console.error('Error adding meal to order:', error)
            throw new Error("Taomni buyurtmaga qo'shishda xatolik yuz berdi")
        }
    }

    async removeMeal(userId, mealId) {
        const order = await Order.exists({
            telegramId: userId,
            is_deleted: false,
            status: 'waiting',
            meals: { $elemMatch: { meal: mealId } },
        })

        if (order) {
            await Order.updateOne(
                { telegramId: userId, is_deleted: false, status: 'waiting' },
                { $pull: { meals: { meal: mealId } } }
            )
        }
    }

    async deleteOrder(userId) {
        const order = await Order.updateOne(
            {
                telegramId: userId,
                is_deleted: false,
                status: 'waiting',
            },
            { is_deleted: true }
        )

        if (order) {
            return 'Buyurtmangiz bekor qilindi'
        } else {
            return 'Siz hali hech narsa buyurtma qilmagansiz'
        }
    }

    async findOrderById(userId) {
        return Order.findOne({
            telegramId: userId,
            is_deleted: false,
            status: 'waiting',
        }).populate('meals.meal user')
    }

    async applyOrder(userId) {
        const order = await Order.findOne({
            telegramId: userId,
            is_deleted: false,
            status: 'waiting',
        })
        let msg = 'Siz hali hech narsa buyurtma qilmagansiz'

        if (order) {
            order.status = 'done'
            order.save()
            return (msg = 'Buyurtmangiz qabul qilindi')
        } else {
            return msg
        }
    }

    async orderList(userId) {
        const order = await Order.findOne({
            telegramId: userId,
            is_deleted: false,
            status: 'waiting',
        }).populate('meals.meal')

        const total = await Order.aggregate([
            {
                $match: {
                    status: 'done',
                    is_deleted: false,
                    telegramId: userId,
                },
            },
            {
                $unwind: '$meals',
            },
            {
                $lookup: {
                    from: 'meals',
                    localField: 'meals.meal',
                    foreignField: '_id',
                    as: 'meal',
                },
            },
            {
                $unwind: '$meal',
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: { $multiply: ['$meals.count', '$meal.price'] },
                    },
                },
            },
        ])

        const orderList = order.meals.map(
            ({ meal: m, count }) =>
                m.name + ' - ' + count + 'x' + ' - ' + count * m.price + " so'm"
        )

        return { orders: orderList.join(',\n'), total }
    }

    async listOrders(query = {}) {
        const queryMatch = { status: 'done', is_deleted: false, ...query }

        const users = await Order.aggregate([
            {
                $match: queryMatch,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'telegramId',
                    foreignField: 'user_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $group: {
                    _id: {
                        user_id: '$telegramId',
                        user_name: '$user.user_name',
                        user_phone: '$user.user_phone',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    user_id: '$_id.user_id',
                    user_name: '$_id.user_name',
                    user_phone: '$_id.user_phone',
                    count: 1,
                },
            },
        ])

        const orders = await Order.aggregate([
            {
                $match: queryMatch,
            },
            {
                $unwind: '$meals',
            },
            {
                $lookup: {
                    from: 'meals',
                    localField: 'meals.meal',
                    foreignField: '_id',
                    as: 'meal',
                },
            },
            {
                $unwind: '$meal',
            },
            {
                $group: {
                    _id: {
                        mealId: '$meals.meal',
                        name: '$meal.name',
                    },
                    total: {
                        $sum: { $multiply: ['$meals.count', '$meal.price'] },
                    },
                    count: { $sum: '$meals.count' },
                },
            },
            {
                $project: {
                    _id: 0,
                    mealId: '$_id.mealId',
                    name: '$_id.name',
                    total: 1,
                    count: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    totalSum: { $sum: '$total' },
                    meals: {
                        $push: {
                            mealId: '$mealId',
                            name: '$name',
                            total: '$total',
                            count: '$count',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalSum: 1,
                    meals: 1,
                },
            },
        ])

        return { total: orders[0]?.totalSum, meals: orders[0]?.meals, users }
    }

    async deleteOldOrders() {
        await Order.updateMany({ is_deleted: false }, { is_deleted: true })
    }

    async updateOrderStatus() {
        await Order.updateMany(
            { status: 'waiting', is_deleted: false },
            { status: 'done' }
        )
    }
}

module.exports = new OrderController()
