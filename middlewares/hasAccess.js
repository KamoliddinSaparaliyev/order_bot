const { simpleKeybaord } = require('../keyboard')
const userModel = require('../models/user.model')

const hasAccess = ({ id }) => {
    userModel.findOne({ user_id: id }, (err, user) => {
        if (err) {
            console.error(err)
            return false
        }

        if (user) {
            return true
        }

        return false
    })
}

// const auth = async (ctx, next) => {
//     const update = ctx.update.message || ctx.update.callback_query
//     if (hasAccess(update.from)) {
//         next()
//         return
//     }

//     await ctx.reply('Sizga ruxsat berilmagan!\n\nBuyurtma bermoqchimisiz?', {
//         reply_markup: simpleKeybaord,
//     })
//     next() // <- and middleware chain continues there...
// }

module.exports = auth
