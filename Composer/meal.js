const { Composer } = require('telegraf')

const mealController = require('../controllers/mealController')
const orderController = require('../controllers/orderController')
const { editMealKeyboard, mealKeyboard, mainKeyboard } = require('../keyboard')

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
            case 'editOrder':
                const editedOrder = await orderController.findOrderById(
                    ctx.from.id
                )
                if (!editedOrder) {
                    ctx.answerCbQuery(
                        'Siz hali hech narsa buyurtma qilmagansiz',
                        true
                    )
                    return
                }

                editedOrder.meals.forEach((meal) => {
                    ctx.reply(
                        `${meal.meal.name} *${meal.count}*x - *${meal.meal.price}* so'm`,
                        {
                            parse_mode: 'Markdown',
                            reply_markup: editMealKeyboard(
                                meal.meal._id,
                                meal.count
                            ),
                        }
                    )
                })

                break
            case 'deleteOrder':
                const deletedOrder = await orderController.deleteOrder(
                    ctx.from.id
                )
                ctx.answerCbQuery(deletedOrder, true)
            case 'order':
                const result = await orderController.addMeal(
                    ctx.from.id,
                    data.m,
                    data.c
                )

                ctx.answerCbQuery(result)
                break
            case 'inc':
                // Inc the meal quantity
                let incedCount = data.c + 1
                await ctx.editMessageReplyMarkup(
                    mealKeyboard(data.m, incedCount)
                )
                break
            case 'dec':
                // Dec the meal quantity
                let decedCount = data.c - 1
                if (decedCount < 1) decedCount = 1
                await ctx.editMessageReplyMarkup(
                    mealKeyboard(data.m, decedCount)
                )
                break
            case 'orders':
                const editOrders = await orderController.orderList(ctx.from.id)
                ctx.reply(editOrders)
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
            case 'userOrder':
                const { meals, total, users } =
                    await orderController.listOrders({
                        telegramId: data.u,
                    })

                const serviceCharge = total * 0.1

                if (meals.length === 0 || users.length === 0 || total === 0) {
                    return ctx.reply('*Hali hech kim buyurtma qilmagan*', {
                        parse_mode: 'Markdown',
                    })
                }

                const user = users[0]

                const userOrders = meals
                    .map(
                        (meal) =>
                            `${meal.name} (*${meal.count}x*) - *${meal.total}* so'm`
                    )
                    .join('\n')

                ctx.reply(
                    `*${user.user_name} ${user?.user_phone}* buyurtmalar:\n\n${userOrders}\n\nJami: *${total}* so'm\nXizmat haqqi(10%) bilan: *${total + serviceCharge}* so'm`,
                    {
                        parse_mode: 'Markdown',
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
