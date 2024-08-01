const { Composer } = require('telegraf')
const { orderKeyboard } = require('../keyboard')
const { GET_USER_ORDER } = require('../actions')

const composer = new Composer()

composer.hears('📦 Buyurtmalarim', async (ctx) => {
    await GET_USER_ORDER(
        ctx,
        { telegramId: ctx.from.id.toString(), status: 'waiting' },
        orderKeyboard
    )
})

module.exports = composer
