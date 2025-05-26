import {Composer} from "grammy";
import {Context} from "@/utils/context";

export const composer = new Composer<Context>()
composer.errorBoundary((err) => {
    console.log('err handler', err)
})
