const { Composer } = require('telegraf')
const orderController = require('../controllers/orderController')
const { randomKeyboard } = require('../keyboard')

const composer = new Composer()

composer.hears('🎲 Random', async (ctx) => {
    const { users } = await orderController.listOrders()

    const randomUser = users[Math.floor(Math.random() * users.length)]
    await ctx.replyWithHTML(
        `🎲 Bugun <b>${randomUser.user_name}</b> (${randomUser.user_phone}) to'laydi.`,
        {
            reply_markup: randomKeyboard,
        }
    )
})

module.exports = composer
