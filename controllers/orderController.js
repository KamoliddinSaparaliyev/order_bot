const Order = require('../models/order.model')

class OrderController {
    // добавление блюда в заказ
    async addMeal(userId, mealId, count) {
        try {
            // Define the query to find the order
            const query = { telegramId: userId, status: 'waiting' }
            let order = await Order.findOne(query)

            if (order) {
                const mealOrder = await Order.findOne({
                    ...query,
                    meals: { $elemMatch: { meal: mealId } },
                })

                if (mealOrder) {
                    await Order.updateOne(
                        { ...query, 'meals.meal': mealId },
                        { $inc: { 'meals.$.count': count } }
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

    // удаление блюда из заказа
    async removeMeal(userId, mealId) {
        // получение заказа из БД
        const order = await Order.exists({
            telegramId: userId,
            served: 'waiting',
            meals: { $elemMatch: { meal: mealId } },
        })

        // поиск блюда в списке заказанных
        if (order) {
            // удаление блюда из заказа
            await Order.updateOne(
                { telegramId: userId, served: 'waiting' },
                { $pull: { meals: { meal: mealId } } }
            )
            // сохранение изменений
            order.save()

            return "Taom buyurtmangizdan o'chirildi"
        } else {
            return 'Bunday taom buyurtmangizda topilmadi'
        }

        // сохранение изменений
    }

    // поиск заказа по id пользователя
    async findOrderById(userId) {
        return Order.findOne({ telegramId: userId, served: 'waiting' })
    }

    // подтверждение заказа
    async applyOrder(userId) {
        const order = await Order.findOne({
            telegramId: userId,
            status: 'waiting',
        })
        let msg = 'Siz hali hech narsa buyurtma qilmagansiz'

        // проверка на наличие заказа
        if (order) {
            order.status = 'done'
            order.save()
            return (msg = 'Buyurtmangiz qabul qilindi')
        } else {
            return msg
        }
    }

    // заказ пользователя для менеджера
    async orderList(userId) {
        // получение заказа из БД
        const order = await Order.findOne({
            telegramId: userId,
            status: 'waiting',
        }).populate('meals.meal')
        const msg = 'Siz hali hech narsa buyurtma qilmagansiz'

        if (!order) {
            return msg
        }

        const total = order.meals.reduce(
            (acc, { meal: m, count }) => acc + m.price * count,
            0
        )

        // формирование списка заказа
        const orderList = order.meals.map(
            ({ meal: m, count }) =>
                m.name + ' - ' + count + 'x' + ' - ' + count * m.price + " so'm"
        )

        return { orders: orderList.join(',\n'), total }
    }

    async userOrder(userId) {
        let total = 0
        let orderList = ''
        // получение заказа из БД
        const orders = await Order.find({
            telegramId: userId,
            status: 'waiting',
        }).populate('meals.meal')

        if (orders.length === 0) {
            return 'Bu foydalanuvchining buyurtmasi topilmadi'
        }

        for (const order of orders) {
            const totalOne = order.meals.reduce(
                (acc, { meal: m, count }) => acc + m.price * count,
                0
            )

            total += totalOne

            // формирование списка заказа
            const orderListOne = order.meals.map(
                ({ meal: m, count }) =>
                    m.name +
                    ' - ' +
                    count +
                    'x' +
                    ' - ' +
                    count * m.price +
                    " so'm"
            )

            orderList += orderListOne.join(',\n')
        }

        return { orders: orderList, total }
    }

    async listAllOrders() {
        const orders = await Order.find({ status: 'done' }).populate([
            {
                path: 'meals.meal',
                select: 'name price',
            },
            {
                path: 'user',
            },
        ])

        let orderList = ''
        let mealCount = {}
        let total = 0
        let userCount = {}
        let userOrders = {}

        for (let i = 0; i < orders.length; i++) {
            const { user, meals } = orders[i]
            const userKey =
                user.user_id + '_' + user.user_name + '_' + user.user_phone

            const oneOrder = orders[i].meals.reduce(
                (acc, { meal: m, count }) => acc + m.price * count,
                0
            )
            const userOrder = {}

            for (let j = 0; j < orders[i].length; j++) {
                const { user, meals } = orders[i]

                meals.forEach((meal) => {
                    const key =
                        user._id +
                        '_' +
                        user.name +
                        '_' +
                        meal._id +
                        '_' +
                        meal.name

                    if (userOrder[key]) {
                        userOrder[key] += meal.count
                    } else {
                        userOrder[key] = meal.count
                    }
                })
                console.log(userOrder)
            }

            total += oneOrder

            for (let j = 0; j < orders[i].meals.length; j++) {
                const { meal, count } = orders[i].meals[j]
                if (mealCount[meal._id + '_' + meal.name + '_' + meal.price]) {
                    mealCount[meal._id + '_' + meal.name + '_' + meal.price] +=
                        count
                } else {
                    mealCount[meal._id + '_' + meal.name + '_' + meal.price] =
                        count
                }
            }

            if (userCount[userKey]) {
                userCount[userKey] = +1
            } else {
                userCount[userKey] = 1
            }
        }

        Object.keys(mealCount).forEach((key) => {
            let [id, name, price] = key.split('_')
            // Parse the price to integer
            price = parseInt(price)

            orderList +=
                name +
                ' - ' +
                mealCount[key] +
                'x\n' +
                ' - ' +
                mealCount[key] * price +
                " so'm\n"
        })

        // inline_keyboard users
        const usersKeyboard = Object.keys(userCount).map((key) => {
            let [id, name, phone] = key.split('_')
            return {
                text:
                    renderName(name, phone) +
                    +' - ' +
                    userCount[key] +
                    ' ta buyurtma',
                callback_data: JSON.stringify({
                    t: 'userOrder',
                    u: id,
                }),
            }
        })

        function renderName(name, phone) {
            if (name.length > 10) {
                return name
            } else {
                return name + ' - ' + phone
            }
        }

        return { orders: orderList, total, usersKeyboard }
    }
}

module.exports = new OrderController()
