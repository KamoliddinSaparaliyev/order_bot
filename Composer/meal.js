const { Composer } = require('telegraf')

const mealController = require('../controllers/mealController')
const orderController = require('../controllers/orderController')
const { mealKeyboard, mainKeyboard } = require('../keyboard')

const composer = new Composer()

composer.on('callback_query', async (ctx) => {
    try {
        let data = JSON.parse(ctx.callbackQuery.data)
        console.log(data)
        const mealId = data.m
        const meal = await mealController.findMealById(mealId)

        switch (data.t) {
            case 'meal':
                if (!meal) {
                    return ctx.replyWithHTML('<b> Bunday ovqat topilmadi! </b>')
                } else {
                    await ctx.replyWithPhoto(
                        { url: meal.img },
                        {
                            caption: `
							*${meal.name} ${meal.price}*
				  			`,
                            parse_mode: 'Markdown',
                            reply_markup: mealKeyboard(mealId, 1),
                        }
                    )
                }
                break
            case 'order':
                const count = data.c

                const result = await orderController.addMeal(
                    ctx.from.id,
                    mealId,
                    count
                )

                ctx.answerCbQuery(result)
                break
            case 'inc':
                // Inc the meal quantity
                let incedCount = data.c + 1
                await ctx.editMessageReplyMarkup(
                    mealKeyboard(mealId, incedCount)
                )
                break
            case 'dec':
                // Dec the meal quantity
                let decedCount = data.c - 1
                if (decedCount < 1) decedCount = 1
                await ctx.editMessageReplyMarkup(
                    mealKeyboard(mealId, decedCount)
                )
                break
            case 'orders':
                const orders = await orderController.orderList(ctx.from.id)
                ctx.reply(orders)
                break
            case 'applyOrder':
                const resultOrder = await orderController.applyOrder(
                    ctx.from.id
                )
                await ctx.replyWithHTML(`<b>${resultOrder}</b>`)
                ctx.answerCbQuery(resultOrder, true, {
                    reply_markup: mainKeyboard,
                })

                break
            case 'editOrder':
                const order = await orderController.findOrderById(ctx.from.id)
                if (!order) {
                    ctx.answerCbQuery(
                        'Siz hali hech narsa buyurtma qilmagansiz',
                        true
                    )
                    return
                }
                const total = order.meals.reduce(
                    (acc, { meal: m, count }) => acc + m.price * count,
                    0
                )
                const orderList = order.meals.map(
                    ({ meal: m, count }) =>
                        m.name +
                        ' - ' +
                        count +
                        'x' +
                        ' - ' +
                        count * m.price +
                        " so'm"
                )
                ctx.editMessageText(
                    orderList.join(',\n') + '\n\nJami: ' + total + " so'm",
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Buyurtmani qabul qilish',
                                        callback_data: JSON.stringify({
                                            t: 'applyOrder',
                                        }),
                                    },
                                    {
                                        text: "Buyurtmani o'chirish",
                                        callback_data: JSON.stringify({
                                            t: 'cancelOrder',
                                        }),
                                    },
                                ],
                            ],
                        },
                    }
                )
                break
            default:
                ctx.answerCbQuery('Unknown action')
        }
    } catch (e) {
        console.error('cant handle start command', e)
    }
})

module.exports = composer
