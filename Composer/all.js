const { Composer } = require('telegraf')

const orderController = require('../controllers/orderController')

const composer = new Composer()

composer.hears('📝 Barcha buyurtmalar', async (ctx) => {
    const { orders, total, usersKeyboard } =
        await orderController.listAllOrders()
    const serviceCharge = total * 0.1

    ctx.reply(
        `*Buyurtmalar:* \n\n${orders}\n\nJami: *${total}* so'm\nXizmat haqqi(10%) bilan:*${total + serviceCharge}*`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: usersKeyboard,
            },
        }
    )
})

module.exports = composer
