const orderController = require('../controllers/orderController')
const { getCurrentDate } = require('../utils')

module.exports = {
    GET_USER_ORDER: async (ctx, query = {}, keyBoard = {}) => {
        const {
            meals = [],
            total = '',
            users = [],
        } = await orderController.listOrders(query)
        const serviceCharge = total * 0.1

        if (meals.length === 0 || users.length === 0 || total === 0) {
            return ctx.reply('*Hali hech nima buyurtma qilinmagan*', {
                parse_mode: 'Markdown',
            })
        }

        const user = users[0]

        const userOrders = meals
            .map(
                (meal) =>
                    `${meal.name} (*${meal.count}x*) - *${meal.total}* so'm`
            )
            .join('\n')

        ctx.reply(
            `*${user.user_name} ${user?.user_phone}* _${getCurrentDate()}_\n\nBuyurtmalar:\n\n${userOrders}\n\nJami: *${total}* so'm\nXizmat haqqi(10%) bilan: *${total + serviceCharge}* so'm`,
            {
                parse_mode: 'Markdown',
                reply_markup: keyBoard ? keyBoard : {},
            }
        )
    },
}
