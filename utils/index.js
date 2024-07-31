const cron = require('node-cron')
const orderController = require('../controllers/orderController')

module.exports = {
    getCurrentDate: () => {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1
        const day = today.getDate()
        return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`
    },
    task: cron.schedule(
        '0 0 * * *',
        async () => await orderController.deleteOldOrders(),
        {
            scheduled: true,
            timezone: 'Asia/Tashkent',
        }
    ),
}
