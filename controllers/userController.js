const mongoose = require('mongoose')

require('../models/user.model')

const User = mongoose.model('user')

class UserController {
    async findUserById(userId) {
        return await User.findOne({ user_id: userId })
    }

    async chechUser(userId) {
        const user = await User.findOne({ user_id: userId })
        return user ? true : false
    }

    async createUser(userId, name, phone) {
        const user = await User.findOne({ user_id: userId, user_phone: phone })

        if (user) {
            await User.findOneAndUpdate(
                { user_id: userId },
                { user_name: name, user_phone: phone }
            )
        }

        await User.create({
            user_id: userId,
            user_name: name,
            user_phone: phone,
        })
    }

    async userOrders(userId) {
        return await User.findOne({ user_id: userId }).populate('orders')
    }
}

module.exports = new UserController()
