const { Composer } = require("telegraf");

const categoryController = require("../controllers/categoryController");
const mealController = require("../controllers/mealController");

const composer = new Composer();

composer.hears("📋 Menu", async (ctx) => {
	try {
		const keyboard = await categoryController.replyCategoryKeyboard();
		await ctx.replyWithHTML(
			`
			<b>Kategoryani tanglang!</b>
		`,
			{
				reply_markup: {
					keyboard: keyboard,
					resize_keyboard: true,
				},
			}
		);
	} catch (error) {
		console.error("cant handle start command", error);
	}
});

composer.on("text", async (ctx) => {
	const text = ctx.message.text.replace("❇️ ", "")
	const category = await categoryController.findCategoryByName(text);
	if (!category) {
		return ctx.reply("Kategoriya topilmadi!");
	}

	const mealKeyboard = await mealController.inlineMealKeyboard(category._id);
	
	await ctx.replyWithHTML(
		`
			<b>${category.name}</b> kategoriyasi:
		`,
		{
			reply_markup: { 
				inline_keyboard: mealKeyboard,
				resize_keyboard: true,
			}
			
		}
	);
});



module.exports = composer;
