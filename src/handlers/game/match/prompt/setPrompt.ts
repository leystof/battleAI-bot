import {Match, MatchStatus} from "@/database/models/match";
import {Context} from "@/database/models/context";
import {matchRepository} from "@/database";
import {checkResultPrompt} from "@/handlers/game/match/prompt/checkResult";
import {clearMatchTimer} from "@/modules/timer/match";

export async function setMatchPrompt(ctx: Context, match: Match,text: string) {
    if (ctx.user.id === match.player1.id) {
        if (match.player1Prompt) {
            return ctx.reply("Вы не можете менять промпт во время игры.")
        }
        match.player1Prompt = text
        await matchRepository.update(match.id, {
            player1Prompt: text
        });
    } else {
        if (match.player2Prompt) {
            return ctx.reply("Вы не можете менять промпт во время игры.")
        }
        match.player2Prompt = text
        await matchRepository.update(match.id, {
            player2Prompt: text
        });
    }

    await ctx.reply(`
<b>✅ Ваш ответ принят!</b>

👥 Ожидаем ответ соперника...

🔍 После получения обоих ответов система проведет анализ и определит победителя.
`)

    if (match.player1Prompt && match.player2Prompt) {
        return checkResultPrompt(match.id)
    }

}