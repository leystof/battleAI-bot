"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMatchPrompt = void 0;
const database_1 = require("../../../../database");
async function setMatchPrompt(ctx, match, text) {
    if (ctx.user.id === match.player1.id) {
        await database_1.matchRepository.update(match.id, {
            player1Prompt: text
        });
    }
    else {
        await database_1.matchRepository.update(match.id, {
            player2Prompt: text
        });
    }
    return ctx.reply(`<b>🔥 Ваш промпт успешно записан/обновлен!</b>
<pre>${ctx.message.text}</pre>
`);
}
exports.setMatchPrompt = setMatchPrompt;
