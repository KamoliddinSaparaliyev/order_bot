const { Composer } = require('telegraf')
require('dotenv').config()

const userController = require('../controllers/userController')

const adminId = process.env.ADMIN_ID

const composer = new Composer()
const { mainKeyboard } = require('../keyboard')

composer.on('message', async (ctx) => {
    try {
        if (
            ctx.update.message.reply_to_message?.text ==
                "Agar kontakt qoldirmasangiz qayta a'loqa yo'lga quya olmaymiz!" ||
            ctx.update.message.reply_to_message?.text ==
                'Iltimos buyurtma berish uchun kontakt qoldiring'
        ) {
            await ctx.replyWithHTML(
                `
				<b>Tanglang</b>
				`,
                {
                    reply_markup: mainKeyboard,
                }
            )

            const phone = ctx.update.message.contact.phone_number
            const name = ctx.update.message.contact.first_name
            const userId = ctx.update.message.contact.user_id
            console.log(phone, name, userId)
            await userController.createUser(userId, name, phone)
        }
    } catch (e) {
        console.error('cant handle start command', e)
    }
})

module.exports = composer
