const { Composer } = require('telegraf')

const userController = require('../controllers/userController');
const { mainKeyboard, simpleKeybaord } = require('../keyboard');

require('dotenv').config();

const composer = new Composer()

composer.command('start', async (ctx) => {
	const user = await userController.chechUser(ctx.from.id);
	console.log(user);
	try {
		if (!user) {
			await ctx.replyWithHTML(
				`<b> Ovqat buyurtma bermoqchimisiz </b>`,
				{
					reply_markup: simpleKeybaord
				},
			);
		} else {
			await ctx.replyWithHTML(
				`<b>Asosiy menu:</b>`,
				{
					reply_markup: mainKeyboard,
				},
			);
		}
	} catch (e) {
		console.error('cant handle start command', e);
	}
});

module.exports = composer