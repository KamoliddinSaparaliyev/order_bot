const { Composer } = require('telegraf')

const composer = new Composer()

composer.hears('Ha ✅', async (ctx) => {
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
})

composer.hears("Yo'q ❌", async (ctx) => {
    await ctx.replyWithHTML(
        `
			<b>Agar kontakt qoldirmasangiz qayta a'loqa yo'lga quya olmaymiz!</b>
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
})

module.exports = composer
