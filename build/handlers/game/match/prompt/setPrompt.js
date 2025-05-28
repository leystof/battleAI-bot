"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMatchPrompt = void 0;
const database_1 = require("../../../../database");
const checkResult_1 = require("../../../../handlers/game/match/prompt/checkResult");
async function setMatchPrompt(ctx, match, text) {
    if (ctx.user.id === match.player1.id) {
        match.player1Prompt = text;
        await database_1.matchRepository.update(match.id, {
            player1Prompt: text
        });
    }
    else {
        match.player2Prompt = text;
        await database_1.matchRepository.update(match.id, {
            player2Prompt: text
        });
    }
    await ctx.reply(`<b>🔥 Ваш промпт успешно записан/обновлен!</b>
<pre>${ctx.message.text}</pre>
`);
    if (match.player1Prompt && match.player2Prompt) {
        return (0, checkResult_1.checkResultPrompt)(match.id);
    }
}
exports.setMatchPrompt = setMatchPrompt;
