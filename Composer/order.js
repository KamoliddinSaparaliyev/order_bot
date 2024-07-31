const { Composer } = require('telegraf')
const orderController = require('../controllers/orderController')
const { orderKeyboard } = require('../keyboard')

const composer = new Composer()

composer.hears('📦 Buyurtmalarim', async (ctx) => {
    const { meals, total, users } = await orderController.listOrders({
        telegramId: ctx.from.id.toString(),
        status: 'waiting',
    })

    const serviceCharge = total * 0.1

    if (meals.length === 0 || users.length === 0 || total === 0) {
        return ctx.reply('*Hali hech kim buyurtma qilmagan*', {
            parse_mode: 'Markdown',
        })
    }

    const user = users[0]

    const userOrders = meals
        .map((meal) => `${meal.name} (*${meal.count}x*) - *${meal.total}* so'm`)
        .join('\n')

    ctx.reply(
        `*${user.user_name} ${user?.user_phone}* buyurtmalar:\n\n${userOrders}\n\nJami: *${total}* so'm\nXizmat haqqi(10%) bilan: *${total + serviceCharge}* so'm`,
        {
            parse_mode: 'Markdown',
            reply_markup: orderKeyboard,
        }
    )
})

module.exports = composer
