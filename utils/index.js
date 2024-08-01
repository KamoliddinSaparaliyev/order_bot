const cron = require('node-cron')
const orderController = require('../controllers/orderController')
const { join } = require('path')

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
    // update status of the order every 24 hours at 1 AM
    updateStatus: cron.schedule(
        // set every day at 1 AM
        '0 1 * * *',
        async () => await orderController.updateOrderStatus(),
        {
            scheduled: true,
            timezone: 'Asia/Tashkent',
        }
    ),
    // take image downloads folder path
    getImgPath: (fileName) => {
        const filePath = join(process.cwd(), 'downloads', fileName)
        return filePath
    },
}
