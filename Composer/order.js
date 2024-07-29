const {Composer} = require('telegraf');
const orderController = require('../controllers/orderController');
const { orderKeyboard } = require('../keyboard');


const composer = new Composer()

composer.hears('📦 Buyurtmalarim', async (ctx) => {
	const {total, orders} = await orderController.orderList(ctx.from.id);
	if (!orders) {
		return ctx.reply("Siz hali hech narsa buyurtma qilmagansiz");
	}

	await ctx.replyWithHTML(
		`	
			<b>Sizning buyurtmalaringiz:</b>\n\n${orders}\n<b>\nUmumiy summa:</b> ${total} so'm\n<b>Xizmat haqqi</b> (10%): ${total * 0.1} so'm\n\nJami: <b>${total + total * 0.1}</b> so'm
		`,
		{
			reply_markup: orderKeyboard
		},
	);
});


module.exports = composer



