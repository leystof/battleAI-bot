import { Context as DefaultContext, SessionFlavor } from 'grammy'
import {User} from "@/database/models/user/user";
import {ScenesFlavor, ScenesSessionFlavor} from "grammy-scenes";

type SessionData = ScenesSessionFlavor & {
    deleteMessage: number[]
    logId?: number,
    id?: number,
    tgId?: number,
    text?: string,
    amount?: number,
    triggerType?: string,
    word?: string,
    messageId?: number,
    messageIdDelete?: number,
    customNotification?: CustomNotification
}

export interface CustomNotification {
    text?: string,
    photo?: string,
    buttons?: []
}

export type Context<T = {}> = DefaultContext &
    SessionFlavor<SessionData> &
    ScenesFlavor &
    T & {
    user?: User
}