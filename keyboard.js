module.exports = {
    mainKeyboard: {
        keyboard: [
            [
                {
                    text: '📋 Menu',
                },
                {
                    text: '📦 Buyurtmalarim',
                },
            ],
            [
                {
                    text: '📝 Barcha buyurtmalar',
                },
                {
                    text: '🎲 Random',
                },
            ],
        ],
        resize_keyboard: true,
    },

    mealKeyboard: (mealId, count) => {
        const inline_keyboard = [
            [
                {
                    text: '-',
                    callback_data: JSON.stringify({
                        t: 'dec',
                        m: mealId,
                        c: count,
                    }),
                },
                {
                    text: count,
                    callback_data: JSON.stringify({
                        t: 'quantity',
                        m: mealId,
                    }),
                },
                {
                    text: '+',
                    callback_data: JSON.stringify({
                        t: 'inc',
                        m: mealId,
                        c: count,
                    }),
                },
            ],
            [
                {
                    text: '🛒 Savatga saqlash',
                    callback_data: JSON.stringify({
                        t: 'order',
                        m: mealId,
                        c: count,
                    }),
                },
            ],
        ]

        return {
            inline_keyboard,
        }
    },

    editMealKeyboard: (mealId, count) => {
        const inline_keyboard = [
            [
                {
                    text: '-',
                    callback_data: JSON.stringify({
                        t: 'dec',
                        m: mealId,
                        c: count,
                    }),
                },
                {
                    text: count,
                    callback_data: JSON.stringify({
                        t: 'quantity',
                        m: mealId,
                    }),
                },
                {
                    text: '+',
                    callback_data: JSON.stringify({
                        t: 'inc',
                        m: mealId,
                        c: count,
                    }),
                },
            ],
            [
                {
                    text: '❌ Bekor qilish',
                    callback_data: JSON.stringify({
                        t: 'cancelOrder',
                        m: mealId,
                        c: count,
                    }),
                },
            ],
        ]

        return {
            inline_keyboard,
        }
    },
    randomKeyboard: {
        keyboard: [
            [
                {
                    text: '🔄 Qayta',
                    callback_data: JSON.stringify({
                        t: 'random',
                    }),
                },
            ],
            [
                {
                    text: '⬅️ Orqaga',
                    callback_data: JSON.stringify({
                        t: 'menu',
                    }),
                },
            ],
        ],
        resize_keyboard: true,
    },

    // Клавиатура для заказа
    orderKeyboard: {
        inline_keyboard: [
            [
                {
                    text: '✍ Tahrirlash',
                    callback_data: JSON.stringify({
                        t: 'editOrder',
                    }),
                },
                {
                    text: '✅ Tasdiqlash',
                    callback_data: JSON.stringify({
                        t: 'applyOrder',
                    }),
                },
            ],
            [
                {
                    text: "⛔ O'chrish",
                    callback_data: JSON.stringify({
                        t: 'deleteOrder',
                    }),
                },
            ],
        ],
    },
}
