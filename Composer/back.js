const {Composer} = require('telegraf')

const composer = new Composer()
const { mainKeyboard } = require('../keyboard');

composer.hears('⬅️ Orqaga', async (ctx) => {
	await ctx.replyWithHTML(
		`
			<b>Asosiy menu</b>
		`,
		{
			reply_markup: mainKeyboard
		},
	);
});

module.exports = composer



