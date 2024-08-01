const { Composer } = require('telegraf')

const userController = require('../controllers/userController')
const { mainKeyboard, simpleKeybaord } = require('../keyboard')

require('dotenv').config()

const composer = new Composer()

composer.command('start', async (ctx) => {
    const user = await userController.chechUser(ctx.from.id)
    console.log(user)
    try {
        if (!user) {
            await ctx.replyWithHTML(
                `
						<b>Iltimos buyurtma berish uchun kontakt qoldiring</b>
					`,
                {
                    reply_markup: JSON.stringify({
                        force_reply: true,
                        keyboard: [
                            [
                                {
                                    text: 'Kontakt jo’natish',
                                    request_contact: true,
                                    one_time_keyboard: true,
                                },
                            ],
                        ],
                        resize_keyboard: true,
                    }),
                }
            )
        } else {
            await ctx.replyWithHTML(`<b>Asosiy menu:</b>`, {
                reply_markup: mainKeyboard,
            })
        }
    } catch (e) {
        console.error('cant handle start command', e)
    }
})

module.exports = composer
