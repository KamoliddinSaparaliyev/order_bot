const mongoose = require('mongoose')
const { Telegraf, session } = require('telegraf')
const { Mongo } = require('@telegraf/session/mongodb')
const { task } = require('./utils')
require('dotenv').config()

const token = process.env.BOT_TOKEN

const store = Mongo({
    url: process.env.MONGO_URI,
    database: 'session',
})

const bot = new Telegraf(token, {
    polling: true,
})

bot.use(session({ store }))

bot.use(require('./Composer/start'))
bot.use(require('./Composer/back'))
bot.use(require('./Composer/all'))
bot.use(require('./Composer/meal'))
bot.use(require('./Composer/order'))
bot.use(require('./Composer/category'))
bot.use(require('./Composer/general'))

bot.catch((err, ctx) => {
    console.log(`Error for ${ctx.updateType}`, err)
})

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to the database')
        task.start()
        bot.launch(() => {
            console.log(`Bot has been started @${bot.botInfo.username}`)
        })
    })
    .catch((err) => {
        console.log('Error connecting to the database', err)
    })
