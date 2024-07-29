const { Composer } = require('telegraf')

const orderController = require('../controllers/orderController')

const composer = new Composer()

composer.hears('📝 Barcha buyurtmalar', async (ctx) => {
    const result = await orderController.listAllOrders()
    console.log(result)
    // await ctx.reply(`Buyurtmalar ro'yhati:
    //     ${orders}
    //     Jami: ${total} so'm`);
})

module.exports = composer
