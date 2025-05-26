import { Context as DefaultContext, SessionFlavor } from 'grammy'
import {ScenesFlavor, ScenesSessionFlavor} from "grammy-scenes";

type SessionData = ScenesSessionFlavor & {
    firstName: string;
    lastName: string;
    patronymic: string;
    birthDay: string;
}


export type Context<T = {}> = DefaultContext &
    SessionFlavor<SessionData> &
    ScenesFlavor &
    T