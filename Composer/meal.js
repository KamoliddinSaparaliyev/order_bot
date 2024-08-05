const { Composer } = require('telegraf')

const mealController = require('../controllers/mealController')
const orderController = require('../controllers/orderController')
const { editMealKeyboard, mealKeyboard, mainKeyboard } = require('../keyboard')
const { getImgPath } = require('../utils')
const { GET_USER_ORDER } = require('../actions')

const composer = new Composer()

composer.on('callback_query', async (ctx) => {
    try {
        let data = JSON.parse(ctx.callbackQuery.data)

        switch (data.t) {
            case 'meal':
                const mealId = data.m
                const meal = await mealController.findMealById(mealId)
                if (!meal) {
                    return ctx.replyWithHTML('<b> Bunday ovqat topilmadi! </b>')
                } else {
                    const imgPath = getImgPath(meal.img)

                    await ctx.replyWithPhoto(
                        { filename: meal.img, source: imgPath },
                        {
                            caption: `
							*${meal.name} ${meal.price}*
				  			`,
                            parse_mode: 'Markdown',
                            reply_markup: mealKeyboard(mealId, 1),
                        }
                    )
                }
                ctx.answerCbQuery()
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
                ctx.answerCbQuery()
                break
            case 'deleteOrder':
                const deletedOrder = await orderController.deleteOrder(
                    ctx.from.id
                )

                ctx.deleteMessage()
                ctx.answerCbQuery(deletedOrder, true, {
                    reply_markup: mainKeyboard,
                })
                break
            case 'order':
                await orderController.addMeal(ctx.from.id, data.m, data.c)
                await ctx.editMessageReplyMarkup(
                    editMealKeyboard(data.m, data.c)
                )
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
            case 'cancelOrder':
                await orderController.removeMeal(ctx.from.id, data.m)
                await ctx.editMessageReplyMarkup(mealKeyboard(data.m, data.c))
                ctx.answerCbQuery()
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
                await GET_USER_ORDER(ctx, {
                    telegramId: data.u,
                })
                ctx.answerCbQuery()
                break
            default:
                ctx.answerCbQuery('Unknown action')
        }
    } catch (e) {
        console.error('cant handle start command', e)
    }
})

module.exports = composer
