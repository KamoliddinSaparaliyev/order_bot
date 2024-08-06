const { Telegraf, session } = require('telegraf')
const { task } = require('./utils')
require('dotenv').config()
const db = require('./config/mongo')

const token = process.env.BOT_TOKEN

const bot = new Telegraf(token, {
    polling: true,
})

bot.use(session())

bot.use(require('./Composer/start'))
bot.use(require('./Composer/back'))
bot.use(require('./Composer/all'))
bot.use(require('./Composer/meal'))
bot.use(require('./Composer/random'))
bot.use(require('./Composer/order'))
bot.use(require('./Composer/category'))
bot.use(require('./Composer/general'))

bot.catch((err, ctx) => {
    console.log(`Error for ${ctx.updateType}`, err)
})

db.connection.once('open', async () => {
    task.start()
    await bot.launch()
})
