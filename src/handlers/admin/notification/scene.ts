import {Composer, InputFile} from "grammy";
import {Context} from "@/database/models/context";
import {Scene} from "grammy-scenes";
import {parseButtons} from "@/helpers/parseButtons";
import {userRepository} from "@/database";
import {Not} from "typeorm";
import {UserStatus} from "@/database/models/user";

export const composer = new Composer<Context>()
composer.callbackQuery(/^admin notifications$/, start)

async function start(ctx: Context) {
    try {
        await ctx.answerCallbackQuery()
    } catch (e) {}

    return ctx.scenes.enter('admin notifications')
}

export const scene = new Scene<Context>('admin notifications')

async function cancel (ctx) {
    try {
        await ctx.deleteMessage()
        ctx.scene.exit()
    } catch (e) {}
}

scene.always().callbackQuery('admin notifications cancel', cancel)

scene.do(async (ctx) => {

    ctx.session.customNotification = {text: undefined, buttons: [], photo: undefined}
    return ctx.reply("Введите текст HTML (можете прикрепить фото/видео)", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Отмена", callback_data: "admin notifications cancel"}]
            ]
        }
    })
})

scene.wait().on('message', async ctx => {
    if (ctx.msg?.text) {
        ctx.session.customNotification.text = ctx.msg.text
    }

    if (ctx.msg?.caption) {
        ctx.session.customNotification.text = ctx.msg.caption
    }

    if (ctx.msg?.photo) {
        ctx.session.customNotification.photo = ctx.msg.photo[ctx.msg.photo.length - 1].file_id
    }

    ctx.session.customNotification.buttons = (parseButtons(ctx.session.customNotification.text)).buttons as []
    ctx.session.customNotification.text = ctx.session.customNotification.text.replaceAll(/:text.+/gmi, "")

    ctx.scene.resume()
})

scene.do(async ctx => {
    const text = `${ctx.session.customNotification.text}`
    const btn = {
        inline_keyboard: [
            [{text: 'Начать рассылку', callback_data: 'admin notifications start'}],
            [{text: 'Отмена', callback_data: 'admin notifications cancel'}]
        ]
    }
    let response = undefined
    if (ctx.session.customNotification.photo) {
        try {
            response = await ctx.replyWithPhoto(ctx.session.customNotification.photo, {
                caption: text,
                reply_markup: {
                    inline_keyboard: ctx.session.customNotification.buttons as any
                }
            })
        } catch (e) {
            // @ts-ignore
            try {ctx.scene.exit()} catch (e) {}
            return ctx.reply(e.toString())
        }

    } else {
        try {
            response = await ctx.reply(text, {
                reply_markup: {
                    inline_keyboard: ctx.session.customNotification.buttons as any
                }
            })
        } catch (e) {
            // @ts-ignore
            try {ctx.scene.exit()} catch (e) {}
            return ctx.reply(e.toString())
        }
    }

    ctx.session.id = response.message_id
    console.log(response,ctx.session.id)
    await ctx.reply(`Выберите вариант`, {
        reply_markup: btn
    })
    ctx.scene.resume()
})

scene.wait().callbackQuery("admin notifications start", async ctx => {
    // @ts-ignore
    try {ctx.scene.exit()} catch (e) {}

    const tgIds = await userRepository.find({
        where: {
            status: Not(UserStatus.BAN)
        },
        select: ['tgId']
    });
    let response = undefined

    response = await ctx.reply(`Начинаю рассылку...`)

    const result = {
        yep: 0,
        nope: []
    }

    const reply_markup = { inline_keyboard: ctx.session.customNotification.buttons }

    for (const user of tgIds) {
        try {
            if (ctx.session.customNotification.photo) await ctx.api.sendPhoto(user.tgId, ctx.session.customNotification.photo, {caption: ctx.session.customNotification.text, reply_markup})
            result.yep++
        } catch (e) {
            result.nope.push({id: user.tgId,text: e.toString()})
        }
        await new Promise(res => setTimeout(res, 1000 * 0.45));
    }

    let text = 'INFO'
    for (const one of result.nope) {
        text += `\n\nid: ${one.id}\nproblem: ${one.text}`
    }

    await ctx.replyWithDocument(new InputFile(Buffer.from(text, 'utf-8'), 'result.txt'), {
        caption: `Отправлено юзерам: ${result.yep}\n${result.nope.length} с ошибкой (чек файл)`,
    })

})
