const {Composer} = require('telegraf')
require('dotenv').config();
const FS = require('../fs/fs')
const path = require('path')

const adminId = process.env.ADMIN_ID

const composer = new Composer()

composer.hears("👥 Foydalanuvchilar ro\'yxati", async (ctx) => {

	if(ctx.update.message.from.id == adminId) {

      const fs = new FS(path.resolve(__dirname, '..','data','users.json'))
		const allUser = JSON.parse(fs.read())

      for(let i = 0; i < allUser.length; i++) {
         
          await ctx.telegram.sendContact(adminId, `${allUser[i].user_phone}`,`${allUser[i].user_name}`)
          await ctx.replyWithHTML(` <b>Foydalanuvchi tartib raqami: ${allUser[i].user_number}</b>`)
      }
   }
   
});

composer.hears("✉️ Maxsus savollar", async (ctx) => {

	if(ctx.update.message.from.id == adminId) {

      const fs = new FS(path.resolve(__dirname, '..','data','question.json'))
		const allQuestion = JSON.parse(fs.read())
      for(let i = 0; i < allQuestion.length; i++) {
          await ctx.telegram.sendContact(adminId, `${allQuestion[i].user_phone}`,`${allQuestion[i].user_name}`)
          await ctx.replyWithHTML(` <b>Savol egasi: ${allQuestion[i].user_name}</b>\n<b>Savol matni: ${allQuestion[i].user_question}</b>`)
      }
   }
   
});


module.exports = composer