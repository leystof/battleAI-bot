import {Match, MatchStatus} from "@/database/models/match";
import {Context} from "@/database/models/context";
import {matchRepository} from "@/database";
import {checkResultPrompt} from "@/handlers/game/match/prompt/checkResult";
import {clearMatchTimer} from "@/modules/timer/match";

export async function setMatchPrompt(ctx: Context, match: Match,text: string) {
    if (ctx.user.id === match.player1.id) {
        match.player1Prompt = text
        await matchRepository.update(match.id, {
            player1Prompt: text
        });
    } else {
        match.player2Prompt = text
        await matchRepository.update(match.id, {
            player2Prompt: text
        });
    }

    await ctx.reply(`<b>🔥 Ваш промпт успешно записан/обновлен!</b>
<pre>${ctx.message.text}</pre>
`)
    if (match.player1Prompt && match.player2Prompt) {
        return checkResultPrompt(match.id)
    }

}