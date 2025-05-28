import {Match, MatchStatus} from "@/database/models/match";
import {Context} from "@/database/models/context";
import {matchRepository} from "@/database";

export async function setMatchPrompt(ctx: Context, match: Match,text: string) {
    if (ctx.user.id === match.player1.id) {
        await matchRepository.update(match.id, {
            player1Prompt: text
        });
    } else {
        await matchRepository.update(match.id, {
            player2Prompt: text
        });
    }

    return ctx.reply(`<b>🔥 Ваш промпт успешно записан/обновлен!</b>
<pre>${ctx.message.text}</pre>
`)
}