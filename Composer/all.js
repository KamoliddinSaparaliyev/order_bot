const { Composer } = require('telegraf')

const orderController = require('../controllers/orderController')
const { getCurrentDate } = require('../utils')

const composer = new Composer()

composer.hears('📝 Barcha buyurtmalar', async (ctx) => await allOrders(ctx))
composer.command('allorders', async (ctx) => await allOrders(ctx))

async function allOrders(ctx) {
    const {
        meals = [],
        total = 0,
        users = [],
    } = await orderController.listOrders()
    const serviceCharge = total * 0.1

    if (meals.length === 0 || users.length === 0 || total === 0) {
        return ctx.reply('*Hali hech kim buyurtma qilmagan*', {
            parse_mode: 'Markdown',
        })
    }

    const usersKeyboard = users.map((user) => [
        {
            text: `${user.user_name} (${user.count})`,
            callback_data: JSON.stringify({
                t: 'userOrder',
                u: user.user_id,
            }),
        },
    ])

    const orders = meals
        .map((meal) => `${meal.name} (*${meal.count}x*) - *${meal.total}* so'm`)
        .join('\n')

    ctx.reply(
        `*${getCurrentDate()}* Buyurtmalar: \n\n${orders}\n\nJami: *${total}* so'm\nXizmat haqqi(10%) bilan: *${total + serviceCharge}* so'm`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: usersKeyboard,
            },
        }
    )
}

module.exports = composer
