import { Context as DefaultContext, SessionFlavor } from 'grammy'
import {User} from "@/database/models/user";
import {ScenesFlavor, ScenesSessionFlavor} from "grammy-scenes";

type SessionData = ScenesSessionFlavor & {
    deleteMessage: number[]
    logId?: number,
    id?: number,
    tgId?: number,
    text?: string,
    triggerType?: string,
    word?: string,
    messageId?: number,
    messageIdDelete?: number,
}

export type Context<T = {}> = DefaultContext &
    SessionFlavor<SessionData> &
    ScenesFlavor &
    T & {
    user?: User
}